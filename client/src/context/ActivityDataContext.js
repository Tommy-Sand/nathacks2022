import React, { useState } from "react";

const ActivityContext = React.createContext();

function ActivityDataProvider({ children }) {
  const [data, setData] = useState([]);
  return (
    <ActivityContext.Provider value={{ data, setData }}>
      {children}
    </ActivityContext.Provider>
  );
}

export { ActivityDataProvider, ActivityContext };
