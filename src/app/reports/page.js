import ApexCharts from "../../components/livechart";
import React, { useState, useEffect } from "react";

export default function Reports({vehicleCount}) {
console.log(vehicleCount)
  return (
    <div className=" flex flex-col r w-full p-10 space-y-24">
        <ApexCharts counts={vehicleCount}></ApexCharts>
    </div>
  );
}
