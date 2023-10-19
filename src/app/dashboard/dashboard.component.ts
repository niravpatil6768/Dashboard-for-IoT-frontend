import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WebService } from 'src/app/web.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stations: any = [];
  allStations: any;
  selectedFilter: string = 'all';
  listView: boolean = false;

  constructor(private webService: WebService, private router: Router) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {

    this.webService.stations().subscribe((data: any) => {

      console.log(data.stations)
      this.stations = data.stations;
      console.log(this.stations);
      this.allStations = data.stations;

    });
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }


  filterStations(): void {
    if (this.selectedFilter === 'all') {
      this.stations = this.allStations;
    } else {
      this.stations = this.allStations.filter((station: { status: string; }) => station.status === this.selectedFilter);
    }
  }

  ngOnChanges() {
    this.filterStations();
  }

  toggleView() {
    this.listView = !this.listView; // Toggle between card and list view
  }


  async addStation() {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Add Station',
      html:
        '<input id="name" class="swal2-input" placeholder="name">' +
        '<select  id="status" class="swal2-select">' +
        '<option value="active">Active</option>' +
        '<option value="inactive">Inactive</option>' +
        '</select>' +
        '<input id="lastseen" class="swal2-input" placeholder="Lastseen in minutes">' +
        '<input id="temp" class="swal2-input" placeholder="temperature in Celsius">' +
        '<input id="humidity" class="swal2-input" placeholder="Humidity%">',


      showCancelButton: true,
      confirmButtonText: 'Add',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        const name = (<HTMLInputElement>document.getElementById('name')).value;
        const status = (<HTMLInputElement>document.getElementById('status')).value;
        const lastseen = (<HTMLInputElement>document.getElementById('lastseen')).value;
        const temp = (<HTMLInputElement>document.getElementById('temp')).value;
        const humidity = (<HTMLInputElement>document.getElementById('humidity')).value;

        const temp1 = parseFloat(temp);
        const lastseen1 = parseFloat(lastseen);
        const humidity1 = parseFloat(humidity);


        if (!name || !status || !lastseen || !temp || !humidity) {
          Swal.showValidationMessage('Please fill out all fields');

        } else {
          if (isNaN(temp1)) {
            Swal.showValidationMessage('Please enter a valid temprature value.');
            return false;
          }
          if (isNaN(lastseen1)) {
            Swal.showValidationMessage('Please enter a valid lastseen value.');
            return false;
          }
          if (isNaN(humidity1) || humidity1 > 100) {
            Swal.showValidationMessage('Please enter a valid humidity value.');
            return false;
          }
        }

        return { name, status, lastseen, temp, humidity };
      },
    });

    if (isConfirmed) {

      const { name, status, lastseen, temp, humidity } = formValues as { name: string, status: string, lastseen: number, temp: number, humidity: number };
      this.add(name, status, lastseen, temp, humidity);
    }

  }


  add(name: string, status: string, lastseen: number, temp: number, humidity: number) {

    const stationData = { name, status, lastseen, temp, humidity };

    this.webService.addstation(stationData).subscribe(
      (response) => {

        console.log('Station added successfully', response);

        this.stations.push(stationData);
      },
      (error) => {
        console.error('Error adding station', error);
      }
    );
  }













}
