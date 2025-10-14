"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components\\ui/input"


import dynamic from "next/dynamic";

import { PersistedInput as UserInput} from "@/components\\ui/inputHomePage";



//import ticketmaster_API from "../../lib/ticketmasterDiscoveryEndpoint";
//import usgsTrails_API from "../../lib/USGSTrailEndpoint";
//import  airportGET  from "../../lib/AirportEndpoint";
//import Weather from "../../lib/weatherEndpoint";
//import amadeusGet from "../../lib/AmadeusServer";

const MapView = dynamic(() => import("../../lib/MapView"), { ssr: false });



export default function Home() {

    const [keywordSearchVenues, setVenues] = useState<any[]>([]);
   
    return (
      <main>
        <section className="w-full flex flex-col items-center justify-center py-16">
          <h1 className="head_text text-center font-extrabold leading-tight sm:text-6xl">
            Discover and Plan:
            <br className="max-md:hidden" />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 bg-clip-text text-transparent">
              Adventure Awaits!
            </span>
          </h1>
        </section>
        <UserInput onResults={(data: any) => { 
          //change the ticketmaster data to feed it into the map component
          console.log(data._embedded.events[0]._embedded.venues);

          const v: any[] = data._embedded.events[0]._embedded.venues.flatMap(
            (e: any) => data?._embedded?.events[0]._embedded.venues ?? []
          );
          setVenues(v)
          
        }} />
        

        <MapView venues={keywordSearchVenues} />
      </main>
    );
}