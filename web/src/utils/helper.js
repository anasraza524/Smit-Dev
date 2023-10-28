import React from 'react'
import Swal from 'sweetalert2'


export const showAlert = (title, text, icon = 'info')=> {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK',
    });
  }

  export const capitalizeString=(str)=> {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  
  export const slugifyString=(str)=> {
    return str.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');
  }
  
  export const isValidEmail=(email)=> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }