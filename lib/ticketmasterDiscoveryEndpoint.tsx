type Post = {
  id: string | number;
  title: string;
  // Add other fields if needed
};

export default async function wiki_API() {
  const data = await fetch('https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&keyword=taylor%20swift&apikey=AxXbvSaSd0AFFgqMUj0HpY9aMp1HIrTx')
  const posts = await data.json()
  /*console.log(posts.get('_embedded', {}).get('_embedded', {}).get('events', []))*/
const events = posts._embedded?.events ?? [];
console.log("events length:", events.length);          // terminal (server logs)
console.log("second event:", events[1] ?? "none");    

  return (
    /*<ul>
        {posts.map((post: Post) => (
            <li key={post.id}>{post.title}</li>
        ))}
    </ul>*/
    posts._embedded.events[2]
  )
}