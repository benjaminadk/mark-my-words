import moment from 'moment'

export const howLongAgo = date => {
  return moment(date).from(moment())
}
