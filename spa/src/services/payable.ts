import { fetchAPI } from "./fetchAPI";
import { PayableType, AssignorType } from "../types";

export const createPayable = async (receivableData: PayableType, assignorData: AssignorType) => {
  const token = localStorage.getItem('accessToken');
  if (!receivableData.assignor) {
    const response = await fetchAPI('payable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ receivableData, assignorData })
    })
    return response.json();
  } else {
    const response = await fetchAPI('payable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ receivableData })
    })
    return response.json();
  }
}
