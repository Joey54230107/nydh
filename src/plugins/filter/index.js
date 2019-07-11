import Vue from 'vue'
import toDate from './toDate'
import toTime from './toTime'

const filters = {
	toDate,
  toTime
}

/*
// 注册filters到Vue
for (let key in filters) {
  Vue.filter(key, filters[key])
}
*/

