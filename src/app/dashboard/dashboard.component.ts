import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StorageService } from '../storage.service';
import { WebService } from 'src/app/web.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stations: any = [];
  allStations: any;
  allStation1: any;
  active : any;
  data1 : any = [];
  activate: boolean = false;
  data2 : any = [];
  inactive : any;
  viewMode: 'card' | 'table' = 'card'; // Initialize the default view mode

  
  selectedFilter: string = 'all';
  listView: boolean = false;
  filteredStations: any[] = [];
  @ViewChild('searchBox') searchInput!: ElementRef<HTMLInputElement>;
  constructor(private webService: WebService, private router: Router, private storageService:StorageService) { }

  ngOnInit(): void {
   
    this.getAll();
    this.data();
  }

  isSidebarActive = false;

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  closeSidebar() {
    this.isSidebarActive = false;
  }

  
  getAll() {

    this.webService.stations().subscribe((data: any) => {

      console.log(data.stations)
      this.stations = data.stations;
      console.log(this.stations);
      this.allStations = data.stations;
      this.allStation1 = data.stations;
      this.data1 = data.stations;
      console.log(this.data1)
      this.data2 = data.stations;;

    });
  }

  
  data() {
    console.log("Data1:", this.data1);
    console.log("Data2:", this.data2);

    if (this.data1 && Array.isArray(this.data1)) {
        this.active = this.stations.filter((data: { status: string; }) => data.status === 'active');
    } else {
        this.active = [];
    }

    if (this.data2 && Array.isArray(this.data2)) {
        this.inactive = this.data2.filter((data: { status: string; }) => data.status === 'inactive');
    } else {
        this.inactive = [];
    }

    console.log("Active:", this.active);
    console.log("Inactive:", this.inactive);
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

  filter(): void {
    if (this.selectedFilter === 'active' || this.selectedFilter === 'inactive') {
      this.stations = this.allStations.filter((station: { status: string; }) => station.status === this.selectedFilter);
    } else {
      
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

  searchQuery: string = '';
  shouldFilter: boolean = false;

  onSearch() {
    if (this.searchQuery) {
      this.shouldFilter = true;
      this.filteredStations = this.allStations.filter((station: any) =>
        station.name.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      );
      this.stations = this.filteredStations;
    } else {
      console.log("fail")
      this.shouldFilter = false;
      this.stations = this.allStations;
    }
  }

  resetFilter() {
    this.searchQuery = '';
    this.shouldFilter = false;
    this.stations = this.allStations;
  }

  public isLoggedIn(){
    return this.storageService.isLoggedIn();
  }

  public logout(){
    this.storageService.clear();
  }



   // Your existing code and logic...

  // Function to set the view mode
  setViewMode(mode: 'card' | 'table'): void {
    this.viewMode = mode;
  }


  




}
