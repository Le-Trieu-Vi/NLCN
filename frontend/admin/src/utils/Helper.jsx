class Helper {
  static getFormattedDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;
    
    return `${formattedDate} ${formattedTime}`;
  }
  
  static customPrice(price) {
    if (typeof price === 'number') {
      return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    return price;
  }
  
}

export default Helper;