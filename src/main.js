import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import moment from "moment";
import 'moment/dist/locale/zh-cn';

moment.locale('zh-cn');
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
