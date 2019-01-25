import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subject } from 'rxjs';

import { Map, View } from 'ol';
import {getCenter} from 'ol/extent.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';

import { Draw, Modify, Snap } from 'ol/interaction.js';
import WKT from 'ol/format/WKT.js';

import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS, Layer, XYZ, WMTS } from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

import * as proj from 'ol/proj';
import * as customProj4 from 'ol/proj/proj4';
import proj4 from 'proj4';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import { equatorial, antarctic, arctic, MapView } from './views';
import { LonLat, MapViewType, MapDrawModeType } from '@models';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView: MapView;
  private map: Map;
  private polygonLayer: Layer;

  private drawSource = new VectorSource();
  private drawLayer = new VectorLayer({
    source: this.drawSource,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 4
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  });

  private draw;
  public zoom$ = new Subject<number>();
  public center$ = new Subject<LonLat>();
  public searchPolygon$ = new Subject<string | null>();
  public epsg$ = new Subject<string>();

  public epsg(): string {
    return this.mapView.projection.epsg;
  }

  public setLayer(layer: Layer): void {
    if (!!this.polygonLayer) {
      this.map.removeLayer(this.polygonLayer);
    }

    this.polygonLayer = layer;
    this.map.addLayer(this.polygonLayer);
  }

  public setDrawFeature(feature): void {
    this.drawSource.clear();
    this.drawSource.addFeature(feature);

    this.searchPolygon$.next(
      this.featureToWKT(feature)
    );
  }

  public setDrawMode(mode: MapDrawModeType): void {
    this.map.removeInteraction(this.draw);

    this.draw = this.createDraw(mode);
    this.map.addInteraction(this.draw);
  }

  public clearDrawLayer(): void {
    this.drawSource.clear();
    this.searchPolygon$.next(null);
  }

  public setCenter(centerPos: LonLat): void {
    const { lon, lat } = centerPos;

    this.map.getView().animate({
      center: proj.fromLonLat([lon, lat]),
      duration: 500
    });
  }

  public setZoom(zoom: number): void {
    this.map.getView().animate({
      zoom, duration: 500
    });
  }

  public setMapView(viewType: MapViewType): void {
    const view = {
      [MapViewType.ANTARCTIC]: antarctic(),
      [MapViewType.ARCTIC]: arctic(),
      [MapViewType.EQUITORIAL]: equatorial()
    }[viewType];

    this.setMap(view);
  }

  private setMap(mapView: MapView): void {
    this.mapView = mapView;

    this.map = (!this.map) ?
    this.createNewMap() :
    this.updatedMap();
  }

  private createNewMap(): Map {
    const newMap = new Map({
      layers: [ this.mapView.layer, this.drawLayer ],
      target: 'map',
      view: this.mapView.view,
      controls: [],
      loadTilesWhileAnimating: true
    });

    const modify = new Modify({ source: this.drawSource });
    modify.on('modifyend', e => {
      const feature = e.features.getArray()[0];
      this.setSearchPolygon(feature);
    });

    newMap.addInteraction(modify);

    this.draw = this.createDraw(MapDrawModeType.POLYGON);
    this.drawLayer.setZIndex(100);

    newMap.addInteraction(this.draw);

    const snap = new Snap({source: this.drawSource});
    newMap.addInteraction(snap);

    newMap.on('moveend', e => {
      const map = e.map;

      const view = map.getView();

      const [lon, lat] = proj.toLonLat(view.getCenter());
      const zoom = view.getZoom();

      this.zoom$.next(zoom);
      this.center$.next({lon, lat});
    });

    return newMap;
  }

  public createDraw(drawMode: MapDrawModeType) {
    const draw = new Draw({
      source: this.drawSource,
      type: drawMode
    });

    draw.on('drawstart', e => this.clearDrawLayer());
    draw.on('drawend', e => this.setSearchPolygon(e.feature));

    return draw;
  }

  private setSearchPolygon = feature => {
    const wktPolygon = this.featureToWKT(feature);

    this.searchPolygon$.next(wktPolygon);
    this.epsg$.next(this.epsg());
  }


  private featureToWKT(feature): string {
    const format = new WKT();
    const granuleProjection = 'EPSG:4326';

    const geometry = feature.getGeometry();

    return format.writeGeometry(geometry, {
      dataProjection: granuleProjection,
      featureProjection: this.epsg()
    });
  }

  private updatedMap(): Map {
    this.map.setView(this.mapView.view);

    this.mapView.layer.setOpacity(1);

    const mapLayers = this.map.getLayers();

    mapLayers.setAt(0, this.mapView.layer);

    return this.map;
  }
}
