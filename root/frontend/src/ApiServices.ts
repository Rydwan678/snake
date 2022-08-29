export async function getUsers(users: number[], token: string | null) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8080/users/${users.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Beaer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.users;
  } catch (error) {
    return error;
  }
}

export async function getMe(token: string | null) {
  try {
    const response = await fetch(`http://127.0.0.1:8080/me`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Beaer ${token}`,
      },
    });
    const data = await response.json();
    return data.user;
  } catch (error) {
    return error;
  }
}
