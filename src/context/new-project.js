import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the UserContext
const NewProjectContext = createContext();

// Custom hook for accessing the UserContext
export function useNewProject() {
  return useContext(NewProjectContext);
}

export default NewProjectContext;