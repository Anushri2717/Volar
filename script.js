// Seat configuration
const seatOptions = ["A","B","C","D","E","F"];
const rows = Array.from({ length: 10 }, (_, i) => i + 1);
let selectedSeat = null;

// Utility functions
function makePNR() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let p = "";
    for (let i = 0; i < 6; i++) p += chars[Math.floor(Math.random() * chars.length)];
    return p;
}
function makeFlightNumber(flightName) {
    const parts = flightName.split("→").map(s => s.trim());
    let code = parts.length === 2 ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase() : flightName.substring(0,2).toUpperCase();
    return code + Math.floor(100 + Math.random() * 900);
}

// Render seat map
function renderSeatMap() {
    const flight = document.getElementById("flight").value;
    const date = document.getElementById("date").value;
    const gender = document.getElementById("gender").value;
    const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");

    const seatMap = document.getElementById("seatMap");
    seatMap.innerHTML = "";

    rows.forEach(row => {
        seatOptions.forEach((col, idx) => {
            const seat = `${row}${col}`;
            const booked = reservations.some(r => r.flight===flight && r.seat===seat && r.date===date);
            const seatBtn = document.createElement("div");
            seatBtn.textContent = seat;
            seatBtn.classList.add("seat", booked ? "booked" : "available");

            // Women's section: first 5 rows reserved for females
            if (gender==="Female" && row>5) seatBtn.classList.add("booked");

            if (!booked && !(gender==="Female" && row>5)) {
                seatBtn.addEventListener("click", ()=>{
                    document.querySelectorAll(".seat.selected").forEach(s=>s.classList.remove("selected"));
                    seatBtn.classList.add("selected");
                    selectedSeat = seat;
                });
            }

            seatMap.appendChild(seatBtn);

            if (idx===2){
                const aisle=document.createElement("div");
                aisle.style.width="20px";
                seatMap.appendChild(aisle);
            }
        });
    });
}

// Toast notification
function showToast(msg){
    const toast=document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),3000);
}

// Dashboard update
function updateDashboard(){
    const flight = document.getElementById("flight").value || "-";
    const date = document.getElementById("date").value || "-";
    const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
    const count = reservations.filter(r => r.flight===flight && r.date===date).length;
    document.getElementById("dashFlight").textContent = flight;
    document.getElementById("dashDate").textContent = date;
    document.getElementById("dashCount").textContent = count;
}

// Load reservations
function loadReservations(){
    const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
    const list = document.getElementById("reservationList");
    list.innerHTML = "";

    reservations.forEach((r,index)=>{
        const li=document.createElement("li");
        li.innerHTML = `${r.passenger} | ${r.gender} | Flight: ${r.flight} | ${r.airline} | ${r.seat} | ${r.class} | ${r.date} | ${r.time}`;

        const cancelBtn=document.createElement("button");
        cancelBtn.textContent="Cancel";
        cancelBtn.addEventListener("click",()=>cancelReservation(index));

        const previewBtn=document.createElement("button");
        previewBtn.textContent="Preview Ticket";
        previewBtn.style.background="#17a2b8";
        previewBtn.addEventListener("click",()=>previewTicket(r));

        const downloadBtn=document.createElement("button");
        downloadBtn.textContent="Download Ticket";
        downloadBtn.style.background="#0b3d91";
        downloadBtn.addEventListener("click",()=>{createTicketPDF(r).save(`${sanitizeFilename(r.passenger)}_ticket.pdf`);});

        li.appendChild(cancelBtn);
        li.appendChild(previewBtn);
        li.appendChild(downloadBtn);
        list.appendChild(li);
    });
}

// Cancel reservation
function cancelReservation(index){
    const reservations = JSON.parse(localStorage.getItem("reservations")||"[]");
    const removed = reservations.splice(index,1);
    localStorage.setItem("reservations",JSON.stringify(reservations));
    selectedSeat=null;
    renderSeatMap();
    loadReservations();
    updateDashboard();
    updateSummary();
    showToast(`Booking canceled: ${removed[0].passenger}`);
}

// Update summary
function updateSummary(){
    const reservations=JSON.parse(localStorage.getItem("reservations")||"[]");
    const summaryDiv=document.getElementById("summary");
    summaryDiv.innerHTML="";
    if (reservations.length===0){summaryDiv.textContent="No bookings yet.";return;}
    const flightMap={};
    reservations.forEach(r=>{
        const key=`${r.flight} (${r.date})`;
        flightMap[key]=(flightMap[key]||0)+1;
    });
    let total=0;
    for(let flight in flightMap){
        total+=flightMap[flight];
        const div=document.createElement("div");
        div.innerHTML=`<span>${flight}</span><span>${flightMap[flight]} seat(s)</span>`;
        summaryDiv.appendChild(div);
    }
    const totalDiv=document.createElement("div");
    totalDiv.innerHTML=`<span>Total Seats Booked</span><span>${total}</span>`;
    summaryDiv.appendChild(totalDiv);
}

// Clear all bookings
document.getElementById("clearBookings").addEventListener("click",()=>{
    if(confirm("Are you sure to clear all bookings?")){
        localStorage.removeItem("reservations");
        selectedSeat=null;
        renderSeatMap(); loadReservations(); updateDashboard(); updateSummary();
        showToast("All bookings cleared");
    }
});

// Form submission
document.getElementById("reservationForm").addEventListener("submit",function(e){
    e.preventDefault();
    const passenger=document.getElementById("passenger").value.trim();
    const gender=document.getElementById("gender").value;
    const flight=document.getElementById("flight").value;
    const airline=document.getElementById("airline").value;
    const cls=document.getElementById("class").value;
    const time=document.getElementById("time").value;
    const date=document.getElementById("date").value;
    const govIdType=document.getElementById("govIdType").value;
    const govIdNumber=document.getElementById("govIdNumber").value.trim();

    if(!selectedSeat){alert("Select a seat!");return;}
    if(!passenger||!flight||!airline||!cls||!time||!date||!govIdType||!govIdNumber){alert("Fill all fields!");return;}

    const reservations=JSON.parse(localStorage.getItem("reservations")||"[]");
    const seatTaken=reservations.some(r=>r.flight===flight&&r.seat===selectedSeat&&r.date===date);
    if(seatTaken){alert("Seat already booked!");renderSeatMap(); return;}

    const newReservation={
        passenger, gender, flight, airline, class:cls, time, date, govIdType, govIdNumber,
        seat:selectedSeat, pnr:makePNR(), flightNo:makeFlightNumber(flight), bookedAt:new Date().toISOString()
    };
    reservations.push(newReservation);
    localStorage.setItem("reservations",JSON.stringify(reservations));

    document.getElementById("reservationForm").reset();
    selectedSeat=null;
    renderSeatMap(); loadReservations(); updateDashboard(); updateSummary();
    showToast(`Booking confirmed: ${passenger} Seat: ${newReservation.seat}`);
});

// Helpers
function sanitizeFilename(name){return name.replace(/[^a-z0-9_\-\.]/gi,'_');}

// Ticket PDF generation
function createTicketPDF(reservation){
    const { passenger, gender, flight, airline, class:cls, seat, date, time, govIdType, govIdNumber, pnr, flightNo }=reservation;
    const { jsPDF }=window.jspdf;
    const doc=new jsPDF({orientation:"landscape", unit:"pt", format:[360,600]});
    const margin=12, width=600-margin*2, height=360-margin*2;
    doc.setFillColor(245,245,245); doc.roundedRect(margin,margin,width,height,8,8,"F");

    doc.setFillColor(11,61,145); doc.roundedRect(margin+8,margin+8,160,height-16,6,6,"F");
    doc.setFontSize(18); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold");
    doc.text("Volar Airlines", margin+88, margin+40, {align:"center"});
    doc.setFontSize(10); doc.setFont("helvetica","normal");
    doc.text("BOARDING PASS", margin+88, margin+60, {align:"center"});

    const startX=margin+8+12+160+12;
    let curY=margin+30;
    const addLabelValue=(label,val)=>{
        doc.setFont("helvetica","bold"); doc.setTextColor(11,61,145); doc.text(label,startX,curY);
        doc.setFont("helvetica","normal"); doc.setTextColor(0,0,0); doc.text(val,startX+80,curY);
        curY+=22;
    };
    addLabelValue("Passenger",passenger);
    addLabelValue("Gender",gender);
    addLabelValue("Flight",flightNo+" • "+flight);
    addLabelValue("Airline",airline);
    addLabelValue("Class",cls);
    addLabelValue("Date",date);
    addLabelValue("Time",time);
    addLabelValue("Seat",seat);
    addLabelValue("PNR",pnr);
    addLabelValue(govIdType,govIdNumber);

    const barcodeX=margin+8+160+12+(width-(160+32))-170;
    const barcodeY=margin+30;
    const bcCanvas=document.createElement("canvas");
    JsBarcode(bcCanvas,`${flightNo}|${seat}|${date}`,{format:"CODE128",width:2,height:40,displayValue:false,margin:4});
    doc.addImage(bcCanvas.toDataURL("image/png"),"PNG",barcodeX,barcodeY,150,40);
    doc.setFontSize(9); doc.setTextColor(0,0,0);
    doc.text(`${flightNo} • ${seat} • ${date}`,barcodeX,barcodeY+58);

    return doc;
}

// Ticket preview
function previewTicket(reservation){
    const doc=createTicketPDF(reservation);
    const blob=doc.output("blob");
    const url=URL.createObjectURL(blob);
    const ticketModal=document.getElementById("ticketModal");
    const iframe=document.getElementById("ticketPreview");
    iframe.src=url; ticketModal.style.display="flex";
    const downloadBtn=document.getElementById("downloadTicketBtn");
    const closeBtn=document.getElementById("closeTicketBtn");
    const newDownload=downloadBtn.cloneNode(true);
    downloadBtn.parentNode.replaceChild(newDownload,downloadBtn);
    newDownload.addEventListener("click",()=>doc.save(`${sanitizeFilename(reservation.passenger)}_ticket.pdf`));
    closeBtn.onclick=()=>{ticketModal.style.display="none"; try{URL.revokeObjectURL(url);}catch(e){}};
}

// Update seat map on flight/date/gender change
["flight","date","gender"].forEach(id=>document.getElementById(id).addEventListener("change",()=>{renderSeatMap(); updateDashboard();}));

// Initial load
renderSeatMap(); loadReservations(); updateDashboard(); updateSummary();
