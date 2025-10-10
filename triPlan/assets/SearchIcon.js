import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function SearchIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={props.color || "currentColor"}
      width={props.size || 24}
      height={props.size || 24}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 
          5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </Svg>
  );
}
