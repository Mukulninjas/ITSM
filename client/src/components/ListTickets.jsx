import { useEffect, useState } from "react";

const ListTickets = () => {

    const [tickets, setTickets] = useState([]);

    const fetchTickets = async () => {
        const response = await FetchTickets();
        setTickets(response);
    }

    useEffect(()=>{
        fetchTickets();
    },[]);
  return (
    <div>ListTickets</div>
  )
}

export default ListTickets;