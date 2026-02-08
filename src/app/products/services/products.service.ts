import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TechProductsResponse } from '../interface/techProducts.interface';
import { environment } from '../../../environment';

const API_URL = environment.apiUrl
@Injectable({ providedIn: 'root' })
export class TechProductService {

    constructor() { }

    private http = inject(HttpClient)

    showAllProducts() {
        const headers = new HttpHeaders()
            .set('api_key', environment.apiKey)
        return this.http.get<TechProductsResponse[]>(`${API_URL}`, { headers })
    }

    searchProductById(id: number) {
        const headers = new HttpHeaders()
            .set('api_key', environment.apiKey)
        return this.http.get<TechProductsResponse>(`${API_URL}/${id}`, { headers })
    }

    searchProductByName(query: string) {
        const headers = new HttpHeaders()
            .set('api_key', environment.apiKey)
        return this.http.get<TechProductsResponse[]>(`${API_URL}?name=${query}`, { headers })
    }
}