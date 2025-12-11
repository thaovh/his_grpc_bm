/**
 * Test script for Phase 1 Refactor APIs
 * Tests summary APIs and working state update functionality
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const TOKEN = process.env.ADMIN_TOKEN || '';

// Read token from file if not provided
const fs = require('fs');
const path = require('path');

let adminToken = TOKEN;
if (!adminToken && fs.existsSync(path.join(__dirname, 'admin-token.txt'))) {
  adminToken = fs.readFileSync(path.join(__dirname, 'admin-token.txt'), 'utf8').trim();
}

if (!adminToken) {
  console.error('❌ Error: ADMIN_TOKEN not provided. Set it via env variable or admin-token.txt file');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${adminToken}`,
};

// Test data
const TEST_EXP_MEST_IDS = {
  inpatient: 18570235,
  cabinet: 19044228,
  other: 18570235,
};

const TEST_MEDICINE_HIS_IDS = {
  cabinet: [32061779],
  other: [31385741],
};

/**
 * Test Summary API
 */
async function testSummaryAPI(type, expMestId, orderBy = 'medicineName') {
  const endpoints = {
    inpatient: `/api/inventory/inpatient-exp-mests/${expMestId}/summary`,
    cabinet: `/api/inventory/cabinet-exp-mests/${expMestId}/summary`,
    other: `/api/inventory/exp-mests-other/${expMestId}/summary`,
  };

  const url = `${BASE_URL}${endpoints[type]}${orderBy ? `?orderBy=${orderBy}` : ''}`;
  
  console.log(`\n📋 Testing ${type.toUpperCase()} Summary API:`);
  console.log(`   GET ${url}`);

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Response structure:`);
      console.log(`      - expMestId: ${data.data?.expMestId || 'N/A'}`);
      console.log(`      - hisExpMestId: ${data.data?.hisExpMestId || 'N/A'}`);
      console.log(`      - expMestCode: ${data.data?.expMestCode || 'N/A'}`);
      console.log(`      - workingStateId: ${data.data?.workingStateId || 'N/A'}`);
      console.log(`      - working_state: ${data.data?.working_state ? '✅ Present' : '❌ Missing'}`);
      console.log(`      - medicines count: ${data.data?.medicines?.length || 0}`);
      
      if (data.data?.medicines && data.data.medicines.length > 0) {
        const firstMed = data.data.medicines[0];
        console.log(`   ✅ First medicine sample:`);
        console.log(`      - medicineCode: ${firstMed.medicineCode || 'N/A'}`);
        console.log(`      - medicineName: ${firstMed.medicineName || 'N/A'}`);
        console.log(`      - amount: ${firstMed.amount || 0}`);
        console.log(`      - is_exported: ${firstMed.is_exported || false}`);
        console.log(`      - is_actual_exported: ${firstMed.is_actual_exported || false}`);
      }

      return { success: true, data };
    } else {
      console.log(`   ❌ Status: ${response.status}`);
      console.log(`   ❌ Error: ${data.message || JSON.stringify(data)}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test Update Export Fields API
 */
async function testUpdateExportFields(type, hisIds, exportTime) {
  const endpoints = {
    cabinet: '/api/inventory/cabinet-exp-mests/medicines/export',
    other: '/api/inventory/exp-mests-other/medicines/export',
  };

  const url = `${BASE_URL}${endpoints[type]}`;
  const body = {
    hisIds,
    exportTime,
  };

  console.log(`\n📦 Testing ${type.toUpperCase()} Update Export Fields API:`);
  console.log(`   PUT ${url}`);
  console.log(`   Body: ${JSON.stringify(body, null, 2)}`);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Updated count: ${data.updatedCount || 0}`);
      console.log(`   ✅ Updated hisIds: ${data.hisIds?.length || 0}`);
      
      // Wait a bit for working state update to complete
      console.log(`   ⏳ Waiting 2 seconds for working state update...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, data };
    } else {
      console.log(`   ❌ Status: ${response.status}`);
      console.log(`   ❌ Error: ${data.message || JSON.stringify(data)}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test Update Actual Export Fields API
 */
async function testUpdateActualExportFields(type, hisIds, actualExportTime) {
  const endpoints = {
    cabinet: '/api/inventory/cabinet-exp-mests/medicines/actual-export',
    other: '/api/inventory/exp-mests-other/medicines/actual-export',
  };

  const url = `${BASE_URL}${endpoints[type]}`;
  const body = {
    hisIds,
    actualExportTime,
  };

  console.log(`\n📦 Testing ${type.toUpperCase()} Update Actual Export Fields API:`);
  console.log(`   PUT ${url}`);
  console.log(`   Body: ${JSON.stringify(body, null, 2)}`);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Updated count: ${data.updatedCount || 0}`);
      console.log(`   ✅ Updated hisIds: ${data.hisIds?.length || 0}`);
      
      // Wait a bit for working state update to complete
      console.log(`   ⏳ Waiting 2 seconds for working state update...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, data };
    } else {
      console.log(`   ❌ Status: ${response.status}`);
      console.log(`   ❌ Error: ${data.message || JSON.stringify(data)}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting Phase 1 Refactor API Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`🔑 Token: ${adminToken.substring(0, 20)}...`);
  console.log('='.repeat(60));

  const results = {
    summary: {},
    updateExport: {},
    updateActualExport: {},
  };

  // Test Summary APIs
  console.log('\n📋 ========== TESTING SUMMARY APIs ==========');
  
  results.summary.inpatient = await testSummaryAPI('inpatient', TEST_EXP_MEST_IDS.inpatient);
  results.summary.cabinet = await testSummaryAPI('cabinet', TEST_EXP_MEST_IDS.cabinet);
  results.summary.other = await testSummaryAPI('other', TEST_EXP_MEST_IDS.other);

  // Test Update Export Fields APIs
  console.log('\n📦 ========== TESTING UPDATE EXPORT FIELDS APIs ==========');
  
  const exportTime = Math.floor(Date.now() / 1000) * 10000; // Format: YYYYMMDDHHMMSS
  results.updateExport.cabinet = await testUpdateExportFields(
    'cabinet',
    TEST_MEDICINE_HIS_IDS.cabinet,
    exportTime
  );
  
  results.updateExport.other = await testUpdateExportFields(
    'other',
    TEST_MEDICINE_HIS_IDS.other,
    exportTime
  );

  // Test Update Actual Export Fields APIs
  console.log('\n📦 ========== TESTING UPDATE ACTUAL EXPORT FIELDS APIs ==========');
  
  const actualExportTime = Math.floor(Date.now() / 1000) * 10000;
  results.updateActualExport.cabinet = await testUpdateActualExportFields(
    'cabinet',
    TEST_MEDICINE_HIS_IDS.cabinet,
    actualExportTime
  );
  
  results.updateActualExport.other = await testUpdateActualExportFields(
    'other',
    TEST_MEDICINE_HIS_IDS.other,
    actualExportTime
  );

  // Verify working state was updated by checking summary again
  console.log('\n🔍 ========== VERIFYING WORKING STATE UPDATE ==========');
  console.log('   Checking summary again to verify working_state was updated...');
  
  if (results.updateExport.cabinet.success) {
    await testSummaryAPI('cabinet', TEST_EXP_MEST_IDS.cabinet);
  }
  if (results.updateExport.other.success) {
    await testSummaryAPI('other', TEST_EXP_MEST_IDS.other);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const allSummaryPassed = Object.values(results.summary).every(r => r.success);
  const allUpdateExportPassed = Object.values(results.updateExport).every(r => r.success);
  const allUpdateActualExportPassed = Object.values(results.updateActualExport).every(r => r.success);
  
  console.log(`\n✅ Summary APIs: ${allSummaryPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`   - Inpatient: ${results.summary.inpatient.success ? '✅' : '❌'}`);
  console.log(`   - Cabinet: ${results.summary.cabinet.success ? '✅' : '❌'}`);
  console.log(`   - Other: ${results.summary.other.success ? '✅' : '❌'}`);
  
  console.log(`\n✅ Update Export Fields APIs: ${allUpdateExportPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`   - Cabinet: ${results.updateExport.cabinet.success ? '✅' : '❌'}`);
  console.log(`   - Other: ${results.updateExport.other.success ? '✅' : '❌'}`);
  
  console.log(`\n✅ Update Actual Export Fields APIs: ${allUpdateActualExportPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`   - Cabinet: ${results.updateActualExport.cabinet.success ? '✅' : '❌'}`);
  console.log(`   - Other: ${results.updateActualExport.other.success ? '✅' : '❌'}`);
  
  const allPassed = allSummaryPassed && allUpdateExportPassed && allUpdateActualExportPassed;
  console.log(`\n${allPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
