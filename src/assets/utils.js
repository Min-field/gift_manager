// 数据赋值
function setNewVal(obj, data) {
	for (let [key, val] of Object.entries(data)){
		obj[key] = val;
	}
}

export {setNewVal}