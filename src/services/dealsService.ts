import axios from 'axios';

const API_URL = 'https://api.trudeals.com';

const getDeals = async ({
  currentPage,
  pageSize
}: any) => {
  currentPage = currentPage || 1;
  pageSize = pageSize || 10;
  const url = `${API_URL}/api/Deals/admin/list?currentPage=${currentPage}&pageSize=${pageSize}&searchText=activeOnly&businessId=0`;
  try {
  const response = await axios.get(url,
    {
      headers: {
        authorization: localStorage.getItem('auth')
      }
    }
  );
  return response;
  } catch (error: any) {
    console.log(error);
    if (error.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }
};

const dealDetails = async (dealId: number, businessId: number) => {
  const url = `${API_URL}/api/Deals/vendor/deal?dealId=${dealId}&businessId=${businessId}`;
  const response = await axios.get(url,
    {
      headers: {
        authorization: localStorage.getItem('auth')
      }
    }
  );
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  } else {
    return response;
  }
}

const updateDeal = async (deal: any) => {
  const url = `${API_URL}/api/Deals/admin/deal`;
  const response = await axios.put(url, deal,
    {
      headers: {
        authorization: localStorage.getItem('auth')
      }
    }
  );
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  } else {
    return response;
  }
}

export default { getDeals, dealDetails, updateDeal };