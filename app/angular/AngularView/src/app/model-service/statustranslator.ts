export function getStatus(code: string) {
    switch (code) {
      case 'PEN':
        return 'Pending';
      case 'EVA':
        return 'Evaluating';
      case 'PRO':
        return 'Processed';
      case 'UNC':
        return 'Unconfirmed';
      case 'GET':
        return 'Retrieved';
      case 'RET':
        return 'Returned';
      case 'ACC':
        return 'Accepted';
      case 'REJ':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }
