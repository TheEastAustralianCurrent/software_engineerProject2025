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

    const [ticketmasterData, setData] = useState<any[]>([]);
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


      {/* input component for the search bar on the home page. Using inputHomePage.tsx for search components */}
        <UserInput onResults={(data: any) => { 
          //Use onresult to wait for a result from inputHomePage from when the user enters a search 
          //data holds what ever the the user entered from the input of the search bar
          //change the ticketmaster data to feed it into the map component
          //this on result in partivular is making a call to the ticketmaster api and getting back event data
          //I am logging the venues of the events to see if I can get the address to plot on the map
          console.log(data._embedded.events[0]._embedded.venues); 
          
          //ONLY GRABBing ONE EVENT!!!!! DONT FORGET TO CHANGE THIS LATER 
          

          //once I get the data and I commpress all lists if there are multiple into one list using flatMap
          //I set the v state to the list of venues using set state. I then hoist the data to the top 
          //so that I can pass it to the map component as a prop to plot the venues on the map
          //I also added a check to see if there is no data back from ticketmaster to avoid errors
          //if there is no data back I set the state to a string that says "YOU GOT NOTHING BACK TRY AGAIN"

          setData(data)
        }} />
        
      {/* map component to display the venues on the map. Using MapView for display and returning what MapView is showing. */}
        <MapView 
        //pass the venues state to the map component as a prop
        venues={ticketmasterData}  />
      </main>
    );
}