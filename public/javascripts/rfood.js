/* eslint-disable */
console.log('call : /javascript/jfood.js');
//
//nongsaroOpenApiRequest.apiKey = "20181109EQDUHW95LIXNGC1KFNTJG";
//nongsaroOpenApiRequest.serviceName = "cropTechInfo";
//nongsaroOpenApiRequest.operationName = "recomendDietDtl";
//nongsaroOpenApiRequest.htmlArea = "nongsaroApiLoadingArea";
//nongsaroOpenApiRequest.callback = "/recommend";

/* 파일 전체에서 ESLint 규칙 경고 미사용 선언 */
/* eslint-disable */
		
// API 요청 URL 변수
var apiKey = "20181109EQDUHW95LIXNGC1KFNTJG";
//var url = "http://api.openweathermap.org/data/2.5/weather?q=seoul&appid=" + appid;

var url = "http://api.nongsaro.go.kr/service/recomendDiet/recomendDietDtl/?apiKey=" + apiKey+"&cntntsNo=89324";



$.getJSON(url, function (data) {

	console.log(data);

	// 날씨 데이터 객체
	var cntntsNo = data.cntntsNo; // 국가명, 일출/일몰			
	var dietDtlNm = data.dietDtlNm; // 도시명
	
	var dietNm = data.dietNm; // 날씨 객체
	var fdInfoFirst = data.fdInfoFirst; // 온도 기압 관련 객체

    console.log('컨텐츠 번호 : ' + date,  cntntsNo);
	

}) // end getJSON()

.fail(function () {
	// 오류 메시지
	alert("loding error");
});



