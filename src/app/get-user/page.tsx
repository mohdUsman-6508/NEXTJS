/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

function route() {
  const [username, setUsername] = useState("osman");
  const [user, setUser] = useState({});
  const debounced = useDebounceCallback(setUsername, 100);

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `/api/get-user?username=${username}`;
        console.log(url);
        const response = await axios.get(url);
        // console.log(response?.data);
        setUser(response?.data.user);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    getUser();
  }, [username]);

  // console.log("user::", user?.email);
  return (
    <div className="">
      <div className="m-10 p-4">
        <input
          className="border-black"
          type="text"
          value={username}
          onChange={(e) => {
            debounced(e.target.value);
          }}
        />
        <div>
          <Separator />
          <p>Username is : {user?.username}</p>
          <p>Email is : {user?.email}</p>
          <p>
            status is :{" "}
            {user?.isAcceptingMessage ? "Accepting" : "Not Accepting"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default route;
