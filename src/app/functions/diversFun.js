export class diversFun {
  convertDate(inputFormat) {
    function pad(s) {
      return (s < 10) ? `0${s}` : s;
    }
    const d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }

  getImg(codeAno) {
    let output = '';
    switch (codeAno) {
      case "LIVCFM":
        output = 'images/ico/ico_liv_v.svg';
        break;
      case "RAMCFM":
        output = 'images/ico/ico_ram_v.svg';
        break;
      case "ECHCFM":
        output = 'images/ico/ico_ram_v.svg';
        break;
      case "LIV":
        output = 'images/ico/ico_pre.svg';
        break;
      case "RAM":
        output = 'images/ico/ico_pre_ram.svg';
        break;
      default:
        output = 'images/ico/ico_liv_a.svg';
    }
    return output;
  }

  getTime(date) {
    try {
      const part = date.split(' ');
      const partstime = part[1].split(':');
      return `${partstime[0]}:${partstime[1]}`;
    } catch (e) {
      return "#error";
    }
  }
  getClassColor(codeAno) {
    let output;
    switch (codeAno) {
      case "LIVCFM":
        output = 'green';
        break;
      case "RAMCFM":
        output = 'green';
        break;
      case "ECHCFM":
        output = 'green';
        break;
      case "pack":
        output = 'purple';
        break;
      default:
        output = 'red';
    }
    return output;
  }

  getIco(codeAno) {
    let output;
    switch (codeAno) {
      case "LIVCFM":
        output = '<i class="fa fa-check" aria-hidden="true"></i> ';
        break;
      case "RAMCFM":
        output = '<i class="fa fa-check" aria-hidden="true"></i> ';
        break;
      case "ECHCFM":
        output = '<i class="fa fa-check" aria-hidden="true"></i> ';
        break;
      case "pack":
        output = '<i class="fa fa-suitcase" aria-hidden="true"></i> ';
        break;
      case "nogps":
        output = '<i class="fa fa-map" aria-hidden="true"></i> ';
        break;
      default:
        output = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ';
    }
    return output;
  }

  // calcule distance entre deux points
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }
}
