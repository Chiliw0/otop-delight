import express from 'express';
import axios from 'axios';

const router = express.Router();

// ตัวแปรเก็บข้อมูล (Cache)
let dataCache = {
    provinces: [],
    districts: [],    // เปลี่ยนชื่อจาก amphures เป็น districts ตามข้อมูลใหม่
    subDistricts: []  // เปลี่ยนชื่อจาก tambons เป็น subDistricts ตามข้อมูลใหม่
};

const loadData = async () => {
    try {
        console.log("⏳ Fetching location data from GitHub (New URLs)...");
        
        // ใช้ Link ใหม่ที่คุณให้มา (Raw URL)
        const [p, d, s] = await Promise.all([
            axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json'),
            axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json'),
            axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/sub_district.json')
        ]);
        
        dataCache.provinces = p.data;
        dataCache.districts = d.data;
        dataCache.subDistricts = s.data;
        
        console.log(`✅ Location data loaded: ${dataCache.provinces.length} provinces`);
    } catch (error) {
        console.error("❌ Failed to load location data:", error.message);
        // ถ้าโหลดไม่ได้จริงๆ จะใช้ Backup Data (ย่อๆ) แทน เพื่อไม่ให้เว็บพัง
        useBackupData();
    }
};

// ฟังก์ชันข้อมูลสำรอง (เผื่อ GitHub ล่ม)
const useBackupData = () => {
    console.log("⚠️ Using Backup Data");
    dataCache.provinces = [{ id: 1, name_th: "กรุงเทพมหานคร" }, { id: 10, name_th: "เชียงใหม่" }];
    dataCache.districts = [{ id: 1001, name_th: "เขตพระนคร", province_id: 1 }];
    dataCache.subDistricts = [{ id: 100101, name_th: "พระบรมมหาราชวัง", zip_code: 10200, district_id: 1001 }];
};

// โหลดข้อมูลทันทีเมื่อเริ่ม Server
loadData();

// --- API Endpoints ---

// 1. ดึงจังหวัดทั้งหมด
router.get('/provinces', (req, res) => {
    // ส่งกลับเฉพาะฟิลด์ที่จำเป็น
    res.json(dataCache.provinces);
});

// 2. ดึงอำเภอ (Filter ตาม province_id)
router.get('/amphoes', (req, res) => {
    const provinceId = req.query.province_id || req.query.province;
    if (!provinceId) return res.json([]);

    // ข้อมูลใหม่ใช้ field 'province_id' ตรงกัน
    const filtered = dataCache.districts.filter(item => 
        String(item.province_id) === String(provinceId)
    );
    res.json(filtered);
});

// 3. ดึงตำบล (Filter ตาม amphoe_id)
router.get('/tambons', (req, res) => {
    const amphoeId = req.query.amphoe_id || req.query.amphoe;
    if (!amphoeId) return res.json([]);

    // **สำคัญ:** ข้อมูลชุดใหม่ใช้ field 'district_id' แทน 'amphure_id'
    const filtered = dataCache.subDistricts.filter(item => 
        String(item.district_id) === String(amphoeId)
    );
    res.json(filtered);
});

export default router;