import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebService {
  readonly ROOT_URL;
  constructor(private http: HttpClient) {
    this.ROOT_URL = environment.API;
   }

   public addstation(Data: any): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/dashboard/addstation`, Data);
  }

  //display products
  public stations(){
    return this.http.get(`${this.ROOT_URL}/dashboard`)
  }
}
