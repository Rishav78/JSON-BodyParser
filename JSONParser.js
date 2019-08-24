function Node(value, prev = null, next = null){
    this.element = value;
    this.next = next;
    this.prev = prev;
    this.getNext = function(){
        return this.next;
    }
    this.getElement = function(){
        return this.element;
    }
    this.setNext = function(next){
        this.next = next;
    }
    this.setElement = function(element){
        this.element = element;
    }
    this.getPrev = function(){
        return this.prev;
    }
    this.setPrev = function(prev){
        this.prev = prev;
    }
}

function Stack(){
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.push = function(element){
        const node = new Node(element, this.tail);
        if(this.size>0){
            this.tail.setNext(node);
        }else{
            this.head = node;
        }
        this.size++;
        // console.log(this.head)
        this.tail = node;
    };
    this.pop = function(){
        if(!this.size){
            return null;
        }else{
            if(this.size === 1){
                let value = this.head.getElement();
                this.head = null;
                this.tail = null;
                this.size--;
                return value;
            }else{
                let prev = this.tail.getPrev();
                let current = this.tail.getElement();
                prev.setNext(null);
                this.tail = prev;
                this.size--;
                return current;
            }
        }
    }
    this.isEmpty = function(){
        return this.size === 0;
    }
}

function next(char, string, index){
    stack = new Stack();
    stack.push(char);
    for(let i=index;i<string.length;i++){
        if(string[i] == '[' || string[i] == '{' || string[i] == '('){
            stack.push(string[i]);
        }
        if(string[i] == ']' || string[i] == '}' || string[i] == ')'){
            stack.pop(string[i]);
            if(stack.isEmpty()){
                return i;
            }
        }
    }
}

function interger(string, index){
    let n = '';
    for(let i=index;i<string.length;i++){
        if(string[i] == ',' || string[i] == '"' || string[i] == ']' || string[i] == '}' || i == string.length-1){
            return {
                index: i,
                value: Number(n)
            };
        }
        n = n+ string[i];
    }
}

function toString(string, index){
    let n = '';
    for(let i=index+1;i<string.length;i++){
        if(string[i] == ',' || string[i] == '"' || string[i] == ']' || string[i] == '}' || i == string.length-1){
            return {
                index: i,
                value: n
            };
        }
        n = n+ string[i];
    }
}

function toObject(string, index){
    let q = next('{', string, index+1);
    console.log(q);
    return {
        index: q,
        value: JSONParser(string, index, q),
    }
}

function array(string, index){
    let a = [];
    let q = next('[',string,index+1);
    for(let i=index+1;i<string.length;i++){
        if(i>q){
            return {
                index: i,
                value: a,
            };
        }
        // if(string[i] == '[' || string[i] == '{'){
        //     stack.push(string[i]);
        // }
        // if(string[i] == ']' || string[i] == '}'){
        //     stack.pop();
        // }
        if(string[i] == ']') continue;
        if(string[i] == '"'){
            let result = toString(string, i);
            i = result.index;
            a.push(result.value);
        }else if(string[i] == '['){
            let result = array(string, i);
            i = result.index;
            a.push(result.value);
        }else if(string[i] == '{'){
            let result = toObject(string, i);
            i = result.index;
            a.push(result.value);
        }else{
            let result = interger(string, i);
            i = result.index;
            a.push(result.value);
        }
    }

}

function JSONParser(string, index=0, limit){
    let stack = new Stack();
    let object = {};
    let property = '';
    let left = true;
    for(let i=index+1;i<(limit || string.length);i++){
        if(string[i] == ','){
            continue;
        }else if(string[i] == ':'){
            left = false;
        }else if(left == true){
            string[i]!='"' && (property += string[i]);
        }else if(left == false){
            
            if(string[i] == '"'){
                let result = toString(string, i);
                object[property] = result.value;
                i = result.index
            }else if(string[i] == '['){
                let result = array(string, i);
                object[property] = result.value;
                i = result.index;
            }else if(string[i] == '{'){
                let result = toObject(string,i);
                object[property] = result.value;
                i = result.index;
            }else{
                let result = interger(string, i);
                object[property] = result.value;
                i = result.index
            }
            left = true;
            property = ''
        }
    }
    return object;
}

console.log(JSONParser(JSON.stringify(obj)))