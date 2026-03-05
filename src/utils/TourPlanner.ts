// src/utils/TourPlanner.ts

export type Interest = 'Elephants' | 'Leopards' | 'Birds' | 'Bears';

// Define a Node (A location in the park)
export interface ParkNode {
    id: string;
    name: string;
    primaryWildlife?: Interest[]; // What you are likely to see here
}

// Define an Edge (A road connecting two locations)
export interface ParkEdge {
    from: string;
    to: string;
    distance: number; // in kilometers or minutes
}

// Mock Data: Yala National Park Graph
export const YALA_NODES: Record<string, ParkNode> = {
    'gate': { id: 'gate', name: 'Palatupana Gate' },
    'junction1': { id: 'junction1', name: 'Main Junction' },
    'buttuwa': { id: 'buttuwa', name: 'Buttuwa Tank', primaryWildlife: ['Elephants', 'Birds'] },
    'akasa': { id: 'akasa', name: 'Akasa Chaitya Road', primaryWildlife: ['Leopards'] },
    'lagoon': { id: 'lagoon', name: 'Pilinnawa Lagoon', primaryWildlife: ['Birds'] },
    'end_camp': { id: 'end_camp', name: 'Sithulpawwa Camp' }
};

export const YALA_EDGES: ParkEdge[] = [
    { from: 'gate', to: 'junction1', distance: 5 },
    { from: 'junction1', to: 'buttuwa', distance: 10 },
    { from: 'junction1', to: 'akasa', distance: 15 },
    { from: 'buttuwa', to: 'lagoon', distance: 8 },
    { from: 'akasa', to: 'lagoon', distance: 12 },
    { from: 'lagoon', to: 'end_camp', distance: 5 },
    { from: 'akasa', to: 'end_camp', distance: 20 },
];

/**
 * Modified Dijkstra's Algorithm
 * Finds the optimal path from Start to End, prioritizing user interests.
 */
export function calculateOptimalRoute(
    startId: string, 
    endId: string, 
    userInterests: Interest[]
): ParkNode[] {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    // Initialize graph
    Object.keys(YALA_NODES).forEach(nodeId => {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
        unvisited.add(nodeId);
    });
    distances[startId] = 0;

    while (unvisited.size > 0) {
        // Find the unvisited node with the smallest known distance/cost
        let currNode: string | null = null;
        unvisited.forEach(node => {
            if (currNode === null || distances[node] < distances[currNode!]) {
                currNode = node;
            }
        });

        if (currNode === null || distances[currNode] === Infinity) break;
        if (currNode === endId) break; // Reached destination

        unvisited.delete(currNode);

        // Check neighbors
        const neighbors = YALA_EDGES.filter(e => e.from === currNode || e.to === currNode);
        
        neighbors.forEach(edge => {
            const neighborId = edge.from === currNode ? edge.to : edge.from;
            if (!unvisited.has(neighborId)) return;

            let edgeWeight = edge.distance;
            const neighborNode = YALA_NODES[neighborId];

            // --- SMART SAFARI LOGIC ---
            // Reduce the "cost" of this route if the destination node has the animals the user wants to see.
            // This pulls the algorithm towards the user's preferred wildlife.
            if (neighborNode.primaryWildlife) {
                const matchesInterest = neighborNode.primaryWildlife.some(animal => userInterests.includes(animal));
                if (matchesInterest) {
                    edgeWeight = edgeWeight * 0.3; // Give a 70% "discount" to favor this path
                }
            }

            const newTotalCost = distances[currNode!] + edgeWeight;

            if (newTotalCost < distances[neighborId]) {
                distances[neighborId] = newTotalCost;
                previous[neighborId] = currNode;
            }
        });
    }

    // Reconstruct the path backwards from end to start
    const path: ParkNode[] = [];
    let current: string | null = endId;
    while (current !== null) {
        path.unshift(YALA_NODES[current]);
        current = previous[current];
    }

    return path;
}