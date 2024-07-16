export const POST = async (req: Request) => {
  const user: User = await req.json();
  console.log(`${process.env.API_HOST}/api/user/create`);
  console.log(user);

  const res = await fetch(`${process.env.API_HOST}/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
  console.log(res);
  
  return Response.json(res, { status: 201 });
}