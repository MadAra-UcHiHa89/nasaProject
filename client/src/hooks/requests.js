const API_URL = "http://localhost:8000"; // since the api's URL will be same just the endpoint will differ

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  try {
    const bitsOfRepsonse = await fetch(`${API_URL}/planets`);
    const response = await bitsOfRepsonse.json();
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
  }
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
