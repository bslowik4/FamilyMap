export type RootStackParamList = {
    Home: undefined; // Home screen doesn't expect any parameters
    Details: { pins: Pin[] }; // Details screen expects an array of Pin objects
  };
  
  export interface Pin {
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title: string;
    description: string;
    value: number;
  }
  