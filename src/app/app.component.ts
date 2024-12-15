import { Component, AfterViewInit, OnDestroy, Inject, HostListener } from '@angular/core';
import * as L from 'leaflet';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Device {
  lat: number;
  lng: number;
  label: string;
  status: string;
  dogsCount: number;
  catsCount: number;
  alertShown?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadePrompt', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: { [key: string]: L.Marker } = {};
  private updateIntervalId: any;
  selectedDevice: Device | null = null;

  private devices: Device[] = [
    { lat: 36.8065, lng: 10.1815, label: 'Tunis',  status: 'Active',   dogsCount: 10, catsCount: 3 },
    { lat: 34.7333, lng: 10.7667, label: 'Sfax',   status: 'Inactive', dogsCount: 4,  catsCount: 5 },
    { lat: 35.8256, lng: 10.6369, label: 'Sousse', status: 'Active',   dogsCount: 7,  catsCount: 2 }
  ];

  displayedColumns = ['label', 'status', 'dogsCount', 'catsCount'];
  chartOptions: any = {};

  constructor(private snackBar: MatSnackBar) {}

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      zoomControl: true
    }).setView([35.8, 10.0], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'assets/pheromone.png',
      iconSize: [80, 100],
      iconAnchor: [40, 100],
      popupAnchor: [0, -90]
    });

    this.devices.forEach(device => {
      const marker = L.marker([device.lat, device.lng], { icon }).addTo(this.map);
      marker.bindPopup(this.getPopupContent(device));
      this.markers[device.label] = marker;

      marker.on('click', () => {
        this.selectedDevice = device;
      });
    });

    // Update chart initially
    this.updateChart();

    // Start fake real-time updates
    this.updateIntervalId = setInterval(() => this.fakeRealTimeUpdate(), 3000);

    // Invalidate size after a short delay to ensure proper initial rendering
    setTimeout(() => this.map.invalidateSize(), 300);
  }

  ngOnDestroy(): void {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }

  // Invalidate size on window resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  getDevices() {
    return this.selectedDevice ? [this.selectedDevice] : [];
  }

  private fakeRealTimeUpdate(): void {
    setTimeout(() => this.map.invalidateSize(), 300);
this.map.invalidateSize();

    this.devices = this.devices.map(device => {
      device.dogsCount += Math.floor(Math.random() * 3);
      device.catsCount += Math.floor(Math.random() * 3);

      const totalAnimals = device.dogsCount + device.catsCount;
      if (totalAnimals >= 20 && !device.alertShown) {
        device.alertShown = true;
        this.showSnackBarAlert(device, totalAnimals);
      }

      const marker = this.markers[device.label];
      if (marker) {
        marker.setPopupContent(this.getPopupContent(device));
      }

      return device;
    });

    this.updateChart();
    // After data updates, ensure map is aware of any layout changes
    this.map.invalidateSize();
  }

  private getPopupContent(device: Device): string {
    return `
      <b>${device.label}</b><br>
      Status: ${device.status}<br>
      Dogs: ${device.dogsCount}<br>
      Cats: ${device.catsCount}
    `;
  }

  private showSnackBarAlert(device: Device, count: number): void {
    this.snackBar.open(
      `High Animal Alert: ${device.label} has ${count} animals!`,
      'Close',
      {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    );
  }

  private updateChart(): void {
    const labels = this.devices.map(d => d.label);
    const values = this.devices.map(d => d.dogsCount + d.catsCount);

    this.chartOptions = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: labels,
        axisTick: { alignWithLabel: true }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Total Animals',
          type: 'bar',
          data: values,
          itemStyle: {
            color: '#42a5f5'
          }
        }
      ]
    };
  }
}
