"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//inputHomePage is a component that will be used on the home page for the search bar
//it uses the Input component from input.tsx and the Button component from button.tsx
//it also uses the ticketmasterClient to make a call to the ticketmaster api
//it has a prop called onResults which is a callback function that will be called when the search is complete
//the onResults function will be passed the data returned from the ticketmaster api
//this way the parent component can get the data and use it to plot the venues on the map

import GET  from "@/lib/ticketmasterClient";
import GET_keyword from "@/lib/ticketmasterClient";
type PersistedInputProps = {
  onResults?: (data: unknown) => void; //callback to pass data back to parent component (the page with the map
};

export function PersistedInput({ onResults }: PersistedInputProps) {
  const [q, setQ] = useState("");
  const [userInput , setUserInput] = useState("");

  //This will be for storing that values of ticketmaster when the user searches by keyword
  const [loading, setLoading] = useState(false); //at first not loading
  const [err, setErr] = useState<string | null>(null); //for storing any errors

  // load persisted value once
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tm-search-q");
      if (stored) setQ(stored);
    } catch {}
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem("tm-search-q", q);
    } catch {}
  }, [q]);

  useEffect(() => {
    try {
      localStorage.setItem("tm-search-keyword", userInput);
    } catch {}
  }, [userInput]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // prevent page reload
    setErr(null);
    
    const keyword = q.trim();
    if (!keyword) return; // no empty searches
    
    //Make api call to ticketmaster using the GET function from ticketmasterClient.ts
    //make all apii calls to server side. That means just make a new file for your api call and do not put "use client" at the top of that file
    //send the uesr input to the GET function and wait for a response. send the response to the input component using the onResults callback function keeping dataa you want/neeed
    //hoist the data to the top so that wee can all use the data in different components or element tags
    try {
      // indicate loading
      setLoading(true);
      // make the call to ticketmaster
      GET_keyword(keyword).then((data: any) => {
        //when we get a result from onresult if we get a response it will be data. else it will be null
        onResults?.(data);});
    } catch (err: unknown) {
      let msg = "Search failed";
      if (err && typeof err === "object") {
        try {
          msg = JSON.stringify(err);
        } catch {
          msg = "Search failed";
        }
      } else if (err) msg = String(err);
      setErr(msg);
    } finally {
      setLoading(false); //nothing is loading anymore
    }
}
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl items-center gap-2">
      {/* from the input ui component 
          look at the input.tsx file to see how it is styled and what props it takes
          this is an extension of that and builds on that returning the input component with some other features
          this will be the search bar on the home page and calling this component on the page.tsx
      */}
      <Input
        className="relative w-full max-w-2xl mx-auto rounded-2xl bg-white text-black placeholder:text-neutral-500 caret-black shadow-xl ring-1 ring-black/5 p-2"



        type="search"
        placeholder="Search events…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search events"
      />

      <Input 
        className="relative w-full max-w-2xl mx-auto rounded-2xl bg-white text-black placeholder:text-neutral-500 caret-black shadow-xl ring-1 ring-black/5 p-2"


        type="search"
        placeholder="Search by attraction, event, or venue"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        aria-label="Search by keyword"
      />
      
      <Button type="submit" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </Button>

      {/* status line (optional) */}
      {err && <span className="text-sm text-red-600">{err}</span>}
    </form>
  );
}
