/* ================================ Create a Donut Chart - Pie Chart ================================*/
// Defined data
let data = [ {
    label: '',
    value: 60
  },
  {
    label: '',
    value: 60
  },
  {
    label: '',
    value: 60
  },
  {
    label: '',
    value: 60
  },
  {
    label: '',
    value: 60
  },
  {
    label: '',
    value: 60
  }
];
  
// Selecting SVG using D3.select()
let svg = d3.select("svg");

let g = svg.append("g")
        .attr("transform", "translate(150, 150)")
        .attr('class', "gTagsBox");
    
// Creating Pie generator
let pie = d3.pie().value(function(d){
    return d.value;
});

// Creating arc
let arc = d3.arc()
            .innerRadius(20)
            .outerRadius(100);

// Grouping different arcs
let arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g");

// Appending path 
arcs.append("path")
    .attr("fill", (data, i)=>{
        let value = data.data;
        return d3.schemeSet3[i];
    })
    .attr("d", arc);

// Adding data to each arc
arcs.append("text")
    .attr('class', (d) => `text`)
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform",(d) => { 
        let x = arc.centroid(d)[0]*0.5;
        let y = arc.centroid(d)[1]*0.5;
        return 'rotate(180 ' + x + "," + y + ')';
    })
    .attr("text-anchor", "middle")
    .text(function(d) {return d.data.label;});

/*=================================== Circular Queue Operation Logic ================================*/
const MaxArySize = 6;

let QueueArray   = [];
let RearIdx      = 0; // Set the initial value of the rear index to 0
let FrontIdx     = 0; 

function CreateQueue()
{
    for(let idx = 0; idx < MaxArySize; idx++)
        QueueArray[idx] = null;
}
CreateQueue();

function Enqueue(data)
{
    /*
    ReadIDx  Pre  | After   | QueueArray = 6
             ------------------------------
              0      1
              1      2
              2      3
              3      4
              4      5
              5      0     
    */
    RearIdx = (RearIdx + 1) % MaxArySize; // First, calculate the position where the data will be added
    if (RearIdx == FrontIdx) // If Rear = Front, then
    {
        console.log('Circular Queue Is Full'); // It means the circular queue is full
        RearIdx--;
        if(RearIdx < 0)
            RearIdx = MaxArySize - 1;
        return false;
    }   
    else // If not, then
    {
        QueueArray[RearIdx] = data; // Add the data to the queue at the position pointed to by the Rear index
        return true;
    }        
}

function Dequeue()
{
    if (FrontIdx == RearIdx) // If Front equals Rear, then
    {
        console.log('Circular Queue Is Empty'); // It means the queue is empty
        return false;
    }
    else // Otherwise
    {
        FrontIdx = (FrontIdx + 1) % MaxArySize; // First, calculate the position where the data to be deleted is located
        data = QueueArray[FrontIdx]; // Next, retrieve the data
        QueueArray[FrontIdx] = null; // Then, delete the data
        return data;
    }
}

function GetDataCount()
{
    let dataCount = 0;

    for(let idx=0; idx < MaxArySize; idx++)
        if(QueueArray[idx] !== null)
            dataCount++;

    return dataCount;
}

function Add()
{
    console.log('[Sub] dataCount = ', GetDataCount());

    if(GetDataCount() < 2)
    {
        return false;
    }
    
    let sumValue = Dequeue() + Dequeue();
    
    return Enqueue(sumValue);
}

function Sub(){

    console.log('[Sub] dataCount = ', GetDataCount());

    if(GetDataCount() < 2)
    {
        console.log("Insufficient data, cannot subtract!");
        return false;
    }

    let subValue = Dequeue() - Dequeue();
    
    return Enqueue(subValue);
}

function FrontItem(){

    let FrontItemIdx = FrontIdx;

    if((FrontItemIdx + 1) == MaxArySize)
        return QueueArray[0];
    else
        return QueueArray[FrontItemIdx + 1];
}

// Print in order from Rear to Front
function List(){
   
    for(let i = RearIdx; i >= (FrontIdx + 1); i--){
        console.log(QueueArray[i]);
    }
    
}

// [DOM] Fetch the current queue status message, Front, and Rear indicators.
let statusMsg = document.querySelector('.statusMsg');
let frontArrow = document.querySelector('.front');
let rearArrow  = document.querySelector('.rear');

// Render the value onto the chart
function renderData(){

    // List: Display the current contents of the queue (from Rear to Front)
    let listData = document.querySelector('.listData');

    listData.textContent = '';

    let DataCount   = GetDataCount(); // Get the current number of items

    let ListDataIdx = RearIdx;        // Get the current RearIdx

    /* Print the queue from RearIdx to FrontIdx */
    while(DataCount)
    {
        listData.textContent = listData.textContent + ' ' + QueueArray[ListDataIdx];
        ListDataIdx--;
        if(ListDataIdx == -1)
            ListDataIdx = MaxArySize - 1;
        
        DataCount--;
    }

    // Render the queue data onto the donut chart
    let PieChartTextAll = document.querySelectorAll('body > div > svg > g > g > text');
    
    for(let idx = 0; idx < MaxArySize; idx++)
    {    
        // Prevent null from being rendered on the chart
        if(QueueArray[idx] == null)
            PieChartTextAll[idx].textContent = '[' + idx + '] ';
        else
            PieChartTextAll[idx].textContent = '[' + idx + '] ' + QueueArray[idx];
    }

    // Render the Front and Rear indicators
    frontArrow.textContent = FrontIdx;
    rearArrow.textContent  = RearIdx;

    // Clear the input field
    let inputData   = document.querySelector('.inputData');
    inputData.value = "";
}

function EnqueueBtnCallBack()
{
    // Clear Queue Status Message
    statusMsg.textContent = "";

    // Retrieve the value from the input field
    let inputData = document.querySelector('.inputData');
    inputData     = inputData.value;

    if(inputData == "")
    {       
        statusMsg.textContent = `Please enter a number!`;
        return;
    }

    // Force the input 'string' to be converted into a 'number'
    inputData  = parseInt(inputData);

    let result = Enqueue(inputData);
    
    if(result)   
        statusMsg.textContent = `Successfully added the value ${inputData} to the queue!`;
    else
        statusMsg.textContent = `The queue is full!`;
        
    renderData();
}
let EnqueueBtn = document.querySelector('.EnqueueBtn');
EnqueueBtn.addEventListener("click", EnqueueBtnCallBack);

function DequeueBtnCallBack()
{
    // Clear Queue Status Message
    statusMsg.textContent = "";

    let result = Dequeue();

    if(!result)
        statusMsg.textContent = `The queue is empty!`;
    else
        statusMsg.textContent = `Successfully removed the value ${result} from the queue!`;

    renderData();
}
let DequeueBtn = document.querySelector('.DequeueBtn');
DequeueBtn.addEventListener("click", DequeueBtnCallBack);

function AddBtnCallBack()
{
    // Clear Queue Status Message
    statusMsg.textContent = "";

    let result = Add();

    if(!result)
        statusMsg.textContent = `Insufficient data, cannot add!`;
    else
        statusMsg.textContent = `Successfully added the first two items in the queue!`;
        
    renderData();
}
let AddBtn = document.querySelector('.AddBtn');
AddBtn.addEventListener("click", AddBtnCallBack);

function SubBtnCallBack()
{
    // Clear Queue Status Message
    statusMsg.textContent = "";

    let result = Sub();

    if(!result)
        statusMsg.textContent = `Insufficient data, cannot subtract!`;
    else
        statusMsg.textContent = `Successfully subtracted the first two items in the queue!`;
    
    renderData();
}
let SubBtn = document.querySelector('.SubBtn');
SubBtn.addEventListener("click", SubBtnCallBack);

function FrontItemBtnCallBack()
{
    let beforeFrontData = FrontItem();
    
    if(beforeFrontData !== null)
        statusMsg.textContent = `The first element at the front of the queue is : ${beforeFrontData}`;
    else
        statusMsg.textContent = `The queue is empty, so there is no data!`;

    renderData();
}
let FrontItemBtn = document.querySelector('.FrontItemBtn');
FrontItemBtn.addEventListener("click", FrontItemBtnCallBack);

function ClearQueue(){

    // Clear Queue Status Message
    statusMsg.textContent = "";
   
    for(let i = 0; i < MaxArySize; i++){
        QueueArray[i] = null;
    }
    statusMsg.textContent = `Queue Cleared!`

    // Reset to Zero
    RearIdx  = 0; 
    FrontIdx = 0; 

    renderData();   
}

/* Reference source
[Creating Charts with D3.js]
https://www.geeksforgeeks.org/d3-js-pie-function/

https://ithelp.ithome.com.tw/articles/10208695

https://ithelp.ithome.com.tw/articles/10279852

https://juejin.cn/post/7103528369433608206

https://shawnlin0201.github.io/d3.js/D3-005-svg-draw-2/

https://www.twblogs.net/a/610b95235f3d1b1b737fa93a
*/