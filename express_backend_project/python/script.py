import sys
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import math as math_module
import folium
from folium import PolyLine


from scipy.spatial.distance import cdist
from scipy.spatial import distance_matrix
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from geopy.geocoders import Nominatim


import plotly.express as px
import plotly.graph_objects as go

import chardet

path1 = ('python/uscities.csv')
with open(path1, 'rb') as file:
    result = chardet.detect(file.read(10000))

cities = pd.read_csv(path1, delimiter=',', encoding='latin1')    
# cities.info()
# print(cities.isnull().sum())

# List of target cities for the Winter Route project
target_cities = ['New York', 'Boston', 'Charlotte', 'Atlanta']

# Filter the DataFrame for the target cities
route = cities[cities['city'].isin(target_cities)]

# Preview the filtered DataFrame
# route.info()

route = route.drop(columns=['military', 'incorporated', 'city_ascii', 'county_fips', 'zips', 'ranking', 'source'])
# Check for missing values
#print(cities.isnull().sum())
# Sort by cities in descending order
route = route.sort_values(by='city', ascending=False)
# print(route.head(2))

path2 = ('python/Events.xlsx')
events = pd.read_excel(path2)
    
# display(events)

city_route = pd.merge(route, events, left_on='id', right_on='id', how='inner')
city_route.to_csv('city_route.csv', index=False)

# Haversine formula to calculate distance between two lat, lng points in kilometers
def haversine(lat1, lon1, lat2, lon2):
    
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math_module.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math_module.sin(dlat/2)**2 + math_module.cos(lat1) * math_module.cos(lat2) * math_module.sin(dlon/2)**2
    c = 2 * math_module.atan2(math_module.sqrt(a), math_module.sqrt(1-a))
    
    # Distance in kilometers
    R = 6371.0  # Radius of the Earth in kilometers
    distance = R * c
    return distance

# In this case we need function to define start point
def cal_distances_cities(city_route, start_point):
    # get the start city
    start_row = city_route[city_route['city'] == start_point].iloc[0]
    start_lat = start_row['lat']
    start_lng = start_row['lng']

    # check that start point and coordinates are OK
    #print(f'Start city: {start_point} | Latitude: {start_lat} | Longitude: {start_lng}')
    # print()

# Calculate distance from start city to all other cities
    city_route['distance_from_start'] = city_route.apply(
        lambda row: haversine(start_lat, start_lng, row['lat'], row['lng']), axis=1)
    
    return city_route[['city', 'state_name', 'distance_from_start', 'lat', 'lng', 'event', 'address']]

# checking un example with start point Atlanta
start_point ='Atlanta'
up_city_route = cal_distances_cities(city_route, start_point)
# print(up_city_route.sort_values(by='distance_from_start'))

def create_distance_matrix(city_route):
    n = len(city_route)
    distance_matrix = np.zeros((n, n))

    for i in range(n):
        for j in range(n):
            if i != j:
                distance_matrix[i, j] = haversine(
                    city_route.iloc[i]['lat'], city_route.iloc[i]['lng'],
                    city_route.iloc[j]['lat'], city_route.iloc[j]['lng']
                )
    return distance_matrix

# Generate distance matrix
distance_matrix = create_distance_matrix(city_route)

# Display distance matrix
# print(pd.DataFrame(distance_matrix, columns=city_route['city'], index=city_route['city']))

def solve_tsp(distance_matrix):
    """
    Solves the one-way Traveling Salesman Problem using the distance matrix.
    Returns the optimal route and total distance.
    """
    # Create the routing index manager
    num_cities = len(distance_matrix)
    manager = pywrapcp.RoutingIndexManager(num_cities, 1, 0)  # Single vehicle, starts at index 0

    # Create the routing model
    routing = pywrapcp.RoutingModel(manager)

    # Define the cost function
    def distance_callback(from_index, to_index):
        # Convert from routing variable index to distance matrix index
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        distance = distance_matrix[from_node][to_node]
        return distance

    # Register the cost function
    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Set the search strategy
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    search_parameters.time_limit.seconds = 30  # Set a time limit for solving

    # Solve the problem
    solution = routing.SolveWithParameters(search_parameters)

    if solution:
        # Extract the route
        route = []
        index = routing.Start(0)  # Start at the depot
        total_distance = 0
        while not routing.IsEnd(index):
            current_node = manager.IndexToNode(index)
            next_index = solution.Value(routing.NextVar(index))
            next_node = manager.IndexToNode(next_index)
            arc_cost = distance_matrix[current_node][next_node]  # Use the distance matrix directly
            total_distance += arc_cost
            route.append(current_node)
            index = next_index
        # Do not add the return to the starting city (New York), just return the route.
        return route, total_distance
    else:
        return None, None
    
    # Generate distance matrix
distance_matrix = create_distance_matrix(city_route)

# Display distance matrix
# print(pd.DataFrame(distance_matrix, columns=city_route['city'], index=city_route['city']))

# checking the code
optimal_route_indices, total_distance = solve_tsp(distance_matrix)

# If solution exists, map indices to city names
if optimal_route_indices:
    optimal_route_tsp = [city_route.iloc[i]['city'] for i in optimal_route_indices]
    #print("Optimal Route TSP:", " -> ".join(optimal_route_tsp))
    #print(f"Total Distance: {total_distance:.2f} km")
#else:
    #print("No solution found.")


import itertools
def calc_route_distance(route, distance_matrix):
    """
    Calculate the total distance of a given route using the distance matrix.
    """
    total_distance = 0
    for i in range(len(route) - 1):
        total_distance += distance_matrix[route[i]][route[i + 1]]
    return total_distance

def calc_all_routes(distance_matrix):
    """
    Calculate all possible routes and their total distances.
    """
    num_cities = len(distance_matrix)
    cities = list(range(num_cities))
    
    # Generate all permutations of cities (excluding the starting point)
    all_routes = itertools.permutations(cities)
    
    optimal_route_iter = None
    optimal_distance_iter = float('inf')
    
    # Evaluate each route
    for route in all_routes:
        total_distance = calc_route_distance(route, distance_matrix)
        if total_distance < optimal_distance_iter:
            optimal_route_iter = route
            optimal_distance_iter = total_distance
            
    return optimal_route_iter, optimal_distance_iter

# Call the function
optimal_route_iter, optimal_distance_iter = calc_all_routes(distance_matrix)


# Convert route indices to city names for display
optimal_route_iter = [city_route.iloc[i]['city'] for i in optimal_route_iter]
#print("Optimal Route itertools:", " -> ".join(optimal_route_iter))
#print(f"Total Distance: {optimal_distance_iter:.2f} km")

#print("Optimal Route Iter")
#print(optimal_route_iter)

save_km = total_distance - optimal_distance_iter
km_percent = (save_km / total_distance ) * 100

# ok this is the optimization statistics
#print(f"Total Distance safe: {save_km:.2f} km")
#print(f"Total Distance in percentage: {km_percent:.2f}%")

print(json.dumps({"result":optimal_route_iter}))
sys.stdout.flush()