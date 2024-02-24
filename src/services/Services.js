import { httpAxios } from './httpAxios';

export async function logout(navigate, signOut) {
  try {
    const response = await httpAxios.get('/api/userlogout'); // Change to GET method
    const data = response.data;

    if (data.error) {
      throw new Error(data.error);
    } else {
      signOut();
      localStorage.removeItem('SessionInfo');
      localStorage.removeItem('SessionEmail');
      navigate("/student/StudentLogin");
    }

  } catch (error) {
    alert(`Error while logging out! ${error}`);
  }
}

export async function getUserData(setUserData) {
  try {
    const response = await httpAxios.get('/api/current-user');
    var data = response.data;

    if (data.error) {
      throw new Error(data.error);
    } else {
      setUserData(data);
    }
  } catch (error) {
    alert(`Error fetching userdata! ${error}`);
  }
}

export async function getNotifs(setNotifs) {
  try {
    const response = await httpAxios.get('/api/getnotifs');
    var data = response.data;

    if (data.error) {
      throw new Error(data.error);
    } else {
      if (Array.isArray(data)) {
        // `data` is an array, you can safely call reverse on it
        data.reverse();
      }
      setNotifs(data)
    }
  } catch (error) {
    alert(`Error fetching userdata! ${error}`);
  }
}

export async function downloadRequest(DownloadReqId) {
  try {
    const response = await httpAxios.post('/api/downloadrequest', { id: DownloadReqId }, { responseType: 'arraybuffer' });
    if (response.status === 200) {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'document.pdf';
      link.click();
    } else {
      throw new Error('Failed to download request');
    }
  } catch (error) {
    alert(`Error while downloading pdf! ${error}`);
  }
}