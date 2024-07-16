export const createUser = async (user: User) => {
  console.log(user);
  try {
    const data = await fetch('/api/user/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

export const updateUser = async () => {
  try {
    const data = await fetch('/api/user/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '홍길동',
        email: '',
      }),
    });
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

export const deleteUser = async () => {
  try {
    const data = await fetch('/api/user/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '홍길동',
        email: '',
      }),
    });
  } catch (error) {
    console.error('Error:', error);
  }
}