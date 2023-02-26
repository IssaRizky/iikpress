<?php

namespace App\Http\Controllers;

use Illuminate\Http\Requests;
use Illuminate\Support\Facades\Http;

class Home extends Controller
{

    public function index(){
        $artikel = Http::get('http://webapi.iik.ac.id/api/berita/all');
        $dataArtikel = $artikel->json()['data'];
        return view('home', compact('dataArtikel'));
        // dd($response->json());
    }



}
