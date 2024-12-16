import { eventCardDatas } from "./constants";

let graph = {};

// this function will return an ordered array of objects
// {address, lat, long}
export function getPath() {
  createGraph(); // this function should only be run once on site load

  fetch("http://18.119.28.180:3000/data")
    //.then((response) => response.json())
    .then((data) => console.log)
    .catch((error) => console.error);

  const res = tsp(graph);
  console.log(res);
  return eventCardDatas;
}

const rad = 0.01745;

// # Haversine formula to calculate distance between two lat, lng points in kilometers
function haversine(lat1, lon1, lat2, lon2) {
  // # Convert latitude and longitude from degrees to radians
  lat1 *= rad;
  lon1 *= rad;
  lat2 *= rad;
  lon2 *= rad;

  // # Haversine formula
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // # Distance in kilometers
  const R = 6371.0; // # Radius of the Earth in kilometers
  const distance = R * c;
  return distance;
}

function createGraph() {
  graph = [];
  eventCardDatas.map((item, i) => {
    let distances = [];
    eventCardDatas.map((item, j) => {
      distances[j] = haversine(
        eventCardDatas[i].lat,
        eventCardDatas[i].long,
        eventCardDatas[j].lat,
        eventCardDatas[j].long
      );
    });
    graph[i] = distances;
  });
}

function tsp(cost) {
  // Number of nodes
  const numNodes = cost.length;
  const nodes = [];

  // Initialize the nodes excluding the fixed starting
  // point (node 0)
  for (let i = 1; i < numNodes; i++) {
    nodes.push(i);
  }

  let minCost = Infinity;

  // Generate all permutations of the remaining nodes
  const permutations = getPermutations(nodes);
  for (let perm of permutations) {
    let currCost = 0;
    let currNode = 0; // Start from node 0

    // Calculate the cost of the current permutation
    for (let i = 0; i < perm.length; i++) {
      currCost += cost[currNode][perm[i]];
      currNode = perm[i];
    }

    // Add the cost to return to the starting node
    currCost += cost[currNode][0];

    // Update the minimum cost if the current cost is
    // lower
    minCost = Math.min(minCost, currCost);
  }

  return minCost;
}

// Helper function to generate all permutations of an array
function getPermutations(array) {
  const result = [];
  if (array.length === 1) {
    return [array];
  }

  for (let i = 0; i < array.length; i++) {
    const current = array[i];
    const remaining = array.slice(0, i).concat(array.slice(i + 1));
    const remainingPermutations = getPermutations(remaining);

    for (let perm of remainingPermutations) {
      result.push([current].concat(perm));
    }
  }

  return result;
}
