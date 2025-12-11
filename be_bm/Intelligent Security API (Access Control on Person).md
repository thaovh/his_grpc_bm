

Intelligent Security API (Access Control on
## Person)
## Developer Guide

## Legal Information
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE DOCUMENT IS PROVIDED "AS IS"
## AND “WITH ALL FAULTS AND ERRORS”. OUR COMPANY MAKES NO REPRESENTATIONS OR
## WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT. IN NO EVENT
WILL OUR COMPANY BE LIABLE FOR ANY SPECIAL, CONSEQUENTIAL, INCIDENTAL, OR INDIRECT
DAMAGES, INCLUDING, AMONG OTHERS, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS
## INTERRUPTION OR LOSS OF DATA, CORRUPTION OF SYSTEMS, OR LOSS OF DOCUMENTATION,
WHETHER BASED ON BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, IN
CONNECTION WITH THE USE OF THE DOCUMENT, EVEN IF OUR COMPANY HAS BEEN ADVISED OF
## THE POSSIBILITY OF SUCH DAMAGES OR LOSS.
Intelligent Security API (Access Control on Person) Developer Guide
i

## Contents
Chapter 1 Overview .................................................................................................................... 1
1.1 Introduction ........................................................................................................................... 1
1.2 Update History ....................................................................................................................... 1
Chapter 2 ISAPI Description ...................................................................................................... 12
2.1 Operation Method ............................................................................................................... 12
2.2 URL Format .......................................................................................................................... 15
2.3 Message Format .................................................................................................................. 16
2.4 Others .................................................................................................................................. 18
Chapter 3 Security .................................................................................................................... 19
## 3.1
Authentication ..................................................................................................................... 19
Chapter 4 Typical Applications .................................................................................................. 21
## 4.1 Manage Person
Information ................................................................................................ 21
4.2 Manage Card Information .................................................................................................... 22
## 4.2.1 Collect Card
Information ............................................................................................. 24
## 4.3 Manage Fingerprint
Information ......................................................................................... 24
4.3.1 Fingerprint Collection ................................................................................................. 26
4.4 Manage Face Information .................................................................................................... 27
4.4.1 Create Face Picture Library ......................................................................................... 27
4.4.2 Collect Face Data ......................................................................................................... 28
4.4.3 Manage Face Records in Face Picture Library ............................................................. 29
## 4.4.4
Configure Facial Recognition Mode ............................................................................ 30
4.5 Configure Access Permission Control Schedule ................................................................... 32
4.6 Configure Authentication Mode Control Schedule .............................................................. 34
## 4.7
Configure Door Control Schedule ........................................................................................ 36
4.8 Remotely Control Door, Elevator, and Buzzer ...................................................................... 38
## 4.9
Configure Password for Remote Door Control ..................................................................... 39
Intelligent Security API (Access Control on Person) Developer Guide
ii

4.10 Configure and Search for Access Control Events ................................................................ 40
4.11 Configure Anti-Passing Back ............................................................................................... 43
4.12 Cross-Controller
Anti-Passing Back Configuration ............................................................. 44
4.12.1 Configure Route Anti-Passing Back Based on Network ............................................. 44
4.12.2 Configure Entrance/Exit Anti-Passing Back Based on Network ................................. 47
4.12.3 Configure Route Anti-Passing Back Based on Card ................................................... 50
4.12.4 Configure Entrance/Exit Anti-Passing Back Based on Card ....................................... 52
4.13 Alarm/Event Receiving ....................................................................................................... 54
4.13.1 Receive Alarm/Event in Arming Mode ...................................................................... 54
4.13.2 Receive Alarm/Event in Listening Mode ................................................................... 56
## 4.14
Configure Attendance Status ............................................................................................. 58
4.15 Other Applications ............................................................................................................. 60
4.15.1 Device/Server
Settings .............................................................................................. 60
## 4.15.2
Multi-Factor Authentication ..................................................................................... 62
4.15.3 Multi-Door Interlocking ............................................................................................ 63
4.15.4 M1 Card Encryption Authentication ......................................................................... 63
4.15.5 Alarm Input and Output ............................................................................................ 63
## 4.15.6
Configuration and Maintenance ............................................................................... 64
Chapter 5 Request URL ............................................................................................................. 68
## 5.1 General
Capabilities ............................................................................................................. 68
5.1.1 /ISAPI/AccessControl/capabilities ............................................................................... 68
5.2 Resource Management ........................................................................................................ 68
## 5.2.1
/ISAPI/AccessControl/CaptureCardInfo/capabilities?format=json .............................. 68
5.2.2 /ISAPI/AccessControl/CaptureCardInfo?format=json ................................................. 69
5.2.3 /ISAPI/AccessControl/CaptureFaceData ..................................................................... 69
## 5.2.4
/ISAPI/AccessControl/CaptureFaceData/capabilities .................................................. 72
5.2.5 /ISAPI/AccessControl/CaptureFaceData/Progress ...................................................... 72
## 5.2.6
/ISAPI/AccessControl/CaptureFaceData/Progress/capabilities ................................... 72
Intelligent Security API (Access Control on Person) Developer Guide
iii

5.2.7 /ISAPI/AccessControl/CaptureFingerPrint .................................................................. 73
5.2.8 /ISAPI/AccessControl/CaptureFingerPrint/capabilities ............................................... 73
## 5.2.9
/ISAPI/AccessControl/CardInfo/capabilities?format=json .......................................... 74
5.2.10 /ISAPI/AccessControl/CardInfo/Count?format=json ................................................. 74
5.2.11 /ISAPI/AccessControl/CardInfo/Count?format=json&employeeNo=<ID> ................ 74
5.2.12 /ISAPI/AccessControl/CardInfo/Delete?format=json ................................................ 75
5.2.13 /ISAPI/AccessControl/CardInfo/Modify?format=json ............................................... 75
5.2.14 /ISAPI/AccessControl/CardInfo/Record?format=json ............................................... 76
5.2.15 /ISAPI/AccessControl/CardInfo/Search?format=json ................................................ 76
5.2.16 /ISAPI/AccessControl/CardInfo/SetUp?format=json ................................................. 77
## 5.2.17
/ISAPI/AccessControl/FingerPrint/Delete/capabilities?format=json ........................ 77
5.2.18 /ISAPI/AccessControl/FingerPrint/Delete?format=json ............................................ 78
5.2.19 /ISAPI/AccessControl/FingerPrint/DeleteProcess?format=json ................................ 78
5.2.20 /ISAPI/AccessControl/FingerPrint/SetUp?format=json ............................................. 79
## 5.2.21
/ISAPI/AccessControl/FingerPrintCfg/capabilities?format=json ............................... 80
5.2.22 /ISAPI/AccessControl/FingerPrintDownload?format=json ....................................... 80
5.2.23 /ISAPI/AccessControl/FingerPrintModify?format=json ............................................ 81
5.2.24 /ISAPI/AccessControl/FingerPrintProgress?format=json .......................................... 81
5.2.25 /ISAPI/AccessControl/FingerPrintUpload?format=json ............................................ 82
5.2.26 /ISAPI/AccessControl/FingerPrintUploadAll?format=json ........................................ 82
## 5.2.27
/ISAPI/AccessControl/UserInfo/capabilities?format=json ........................................ 83
5.2.28 /ISAPI/AccessControl/UserInfo/Count?format=json ................................................. 83
5.2.29 /ISAPI/AccessControl/UserInfo/Delete?format=json ................................................ 84
5.2.30 /ISAPI/AccessControl/UserInfo/Modify?format=json ............................................... 84
5.2.31 /ISAPI/AccessControl/UserInfo/Record?format=json ............................................... 84
5.2.32 /ISAPI/AccessControl/UserInfo/Search?format=json ................................................ 85
5.2.33 /ISAPI/AccessControl/UserInfo/SetUp?format=json ................................................. 85
## 5.2.34
/ISAPI/AccessControl/UserInfoDetail/Delete/capabilities?format=json ................... 86
Intelligent Security API (Access Control on Person) Developer Guide
iv

5.2.35 /ISAPI/AccessControl/UserInfoDetail/Delete?format=json ...................................... 86
5.2.36 /ISAPI/AccessControl/UserInfoDetail/DeleteProcess?format=json .......................... 87
## 5.3 Access Control Resource
Settings ........................................................................................ 87
5.3.1 /ISAPI/AccessControl/AcsCfg/capabilities?format=json ............................................. 87
5.3.2 /ISAPI/AccessControl/AcsCfg?format=json ................................................................. 88
5.3.3 /ISAPI/AccessControl/AntiSneakCfg/capabilities?format=json ................................... 88
5.3.4 /ISAPI/AccessControl/AntiSneakCfg?format=json ...................................................... 89
5.3.5 /ISAPI/AccessControl/attendanceStatusModeCfg/capabilities?format=json ............. 89
5.3.6 /ISAPI/AccessControl/attendanceStatusModeCfg?format=json ................................. 90
5.3.7 /ISAPI/AccessControl/attendanceStatusRuleCfg/capabilities?format=json ................ 90
5.3.8 /ISAPI/AccessControl/attendanceStatusRuleCfg?attendanceStatus=&format=json ... 91
5.3.9 /ISAPI/AccessControl/CardReaderAntiSneakCfg/<ID>?format=json .......................... 92
## 5.3.10
/ISAPI/AccessControl/CardReaderAntiSneakCfg/capabilities?format=json .............. 92
5.3.11 /ISAPI/AccessControl/CardReaderCfg/<ID>?format=json ......................................... 93
## 5.3.12
/ISAPI/AccessControl/CardReaderCfg/capabilities?format=json .............................. 94
5.3.13 /ISAPI/AccessControl/ClearAntiSneakCfg/capabilities?format=json ........................ 94
## 5.3.14
/ISAPI/AccessControl/ClearAntiSneakCfg?format=json ............................................ 94
## 5.3.15
/ISAPI/AccessControl/ClearGroupCfg/capabilities?format=json .............................. 95
5.3.16 /ISAPI/AccessControl/ClearGroupCfg?format=json .................................................. 95
## 5.3.17
/ISAPI/AccessControl/Configuration/lockType/capabilities?format=json ................. 95
5.3.18 /ISAPI/AccessControl/Configuration/lockType?format=json .................................... 96
## 5.3.19
/ISAPI/AccessControl/Configuration/NFCCfg/capabilities?format=json ................... 96
## 5.3.20
/ISAPI/AccessControl/Configuration/NFCCfg?format=json ....................................... 97
5.3.21 /ISAPI/AccessControl/Configuration/RFCardCfg/capabilities?format=json .............. 98
5.3.22 /ISAPI/AccessControl/Configuration/RFCardCfg?format=json .................................. 98
5.3.23 /ISAPI/AccessControl/Door/param/<ID> .................................................................. 99
## 5.3.24
/ISAPI/AccessControl/Door/param/<ID>/capabilities ............................................... 99
5.3.25 /ISAPI/AccessControl/FaceCompareCond ............................................................... 100
Intelligent Security API (Access Control on Person) Developer Guide
v

5.3.26 /ISAPI/AccessControl/FaceCompareCond/capabilities ........................................... 100
5.3.27 /ISAPI/AccessControl/FaceRecognizeMode/capabilities?format=json ................... 101
5.3.28 /ISAPI/AccessControl/FaceRecognizeMode?format=json ....................................... 101
5.3.29 /ISAPI/AccessControl/GroupCfg/<ID>?format=json ............................................... 102
## 5.3.30
/ISAPI/AccessControl/GroupCfg/capabilities?format=json ..................................... 103
5.3.31 /ISAPI/AccessControl/IDBlackListCfg ....................................................................... 103
5.3.32 /ISAPI/AccessControl/IDBlackListCfg/capabilities ................................................... 103
5.3.33 /ISAPI/AccessControl/IdentityTerminal ................................................................... 104
5.3.34 /ISAPI/AccessControl/IdentityTerminal/capabilities ............................................... 104
5.3.35 /ISAPI/AccessControl/LogModeCfg/capabilities?format=json ................................ 105
5.3.36 /ISAPI/AccessControl/LogModeCfg?format=json ................................................... 105
5.3.37 /ISAPI/AccessControl/M1CardEncryptCfg ............................................................... 106
## 5.3.38
/ISAPI/AccessControl/M1CardEncryptCfg/capabilities ........................................... 106
## 5.3.39
/ISAPI/AccessControl/MultiCardCfg/<ID>?format=json ......................................... 107
5.3.40 /ISAPI/AccessControl/MultiCardCfg/capabilities?format=json ............................... 108
5.3.41 /ISAPI/AccessControl/MultiDoorInterLockCfg/capabilities?format=json ............... 108
## 5.3.42
/ISAPI/AccessControl/MultiDoorInterLockCfg?format=json ................................... 108
5.3.43 /ISAPI/AccessControl/OSDPModify/<ID>?format=json .......................................... 109
## 5.3.44
/ISAPI/AccessControl/OSDPModify/capabilities?format=json ................................ 109
5.3.45 /ISAPI/AccessControl/PhoneDoorRightCfg/<ID>?format=json ............................... 110
## 5.3.46
/ISAPI/AccessControl/PhoneDoorRightCfg/capabilities?format=json .................... 111
5.3.47 /ISAPI/AccessControl/ReaderAcrossHost ................................................................ 111
## 5.3.48
/ISAPI/AccessControl/ReaderAcrossHost/capabilities ............................................ 112
5.3.49 /ISAPI/AccessControl/remoteControlPWCfg/capabilities?format=json .................. 112
5.3.50 /ISAPI/AccessControl/remoteControlPWCfg/door/<ID>?format=json ................... 112
5.3.51 /ISAPI/AccessControl/ServerDevice ........................................................................ 113
## 5.3.52
/ISAPI/AccessControl/ServerDevice/capabilities .................................................... 114
## 5.3.53
/ISAPI/AccessControl/SmsRelativeParam/capabilities?format=json ...................... 114
Intelligent Security API (Access Control on Person) Developer Guide
vi

5.3.54 /ISAPI/AccessControl/SmsRelativeParam?format=json .......................................... 114
5.3.55 /ISAPI/AccessControl/SnapConfig ........................................................................... 115
## 5.3.56
/ISAPI/AccessControl/SnapConfig/capabilities ....................................................... 115
5.3.57 /ISAPI/AccessControl/StartReaderInfo .................................................................... 116
5.3.58 /ISAPI/AccessControl/StartReaderInfo/capabilities ................................................ 116
5.3.59 /ISAPI/AccessControl/SubmarineBack .................................................................... 117
5.3.60 /ISAPI/AccessControl/SubmarineBack/capabilities ................................................. 117
5.3.61 /ISAPI/AccessControl/SubmarineBackHostInfo/capabilities ................................... 118
5.3.62 /ISAPI/AccessControl/SubmarineBackHostInfo/ConfigureNo/<ID> ........................ 118
5.3.63 /ISAPI/AccessControl/SubmarineBackMode .......................................................... 119
5.3.64 /ISAPI/AccessControl/SubmarineBackMode/capabilities ....................................... 120
5.3.65 /ISAPI/AccessControl/SubmarineBackReader/capabilities ..................................... 120
## 5.3.66
/ISAPI/AccessControl/SubmarineBackReader/ConfigureNo/<ID> .......................... 121
## 5.3.67
/ISAPI/AccessControl/Verification/ttsText/capabilities?format=json ...................... 121
5.3.68 /ISAPI/AccessControl/Verification/ttsText?format=json ......................................... 122
5.3.69 /ISAPI/AccessControl/WiegandCfg/capabilities ...................................................... 122
5.3.70 /ISAPI/AccessControl/WiegandCfg/wiegandNo/<ID> ............................................. 123
5.3.71 /ISAPI/AccessControl/WiegandRuleCfg ................................................................... 123
## 5.3.72
/ISAPI/AccessControl/WiegandRuleCfg/capabilities ............................................... 124
## 5.4 Other Resource
Settings .................................................................................................... 125
5.4.1 /ISAPI/Intelligent/FDLib/capabilities?format=json ................................................... 125
5.4.2 /ISAPI/Intelligent/FDLib/Count?format=json ............................................................ 125
5.4.3 /ISAPI/Intelligent/FDLib/Count?format=json&FDID=&faceLibType= ........................ 125
5.4.4 /ISAPI/Intelligent/FDLib/FaceDataRecord?format=json ........................................... 126
5.4.5 /ISAPI/Intelligent/FDLib/FDSearch/Delete?format=json&FDID=&faceLibType= ...... 126
5.4.6 /ISAPI/Intelligent/FDLib/FDSearch?format=json ...................................................... 127
5.4.7 /ISAPI/Intelligent/FDLib/FDSearch?format=json&FDID=&FPID=&faceLibType= ...... 127
5.4.8 /ISAPI/Intelligent/FDLib/FDSetUp?format=json ....................................................... 128
Intelligent Security API (Access Control on Person) Developer Guide
vii

5.4.9 /ISAPI/Intelligent/FDLib?format=json ....................................................................... 129
5.4.10 /ISAPI/Intelligent/FDLib?format=json&FDID=&faceLibType= ................................. 130
5.4.11 /ISAPI/SecurityCP/AlarmInCfg/<ID>?format=json .................................................. 131
## 5.4.12
/ISAPI/SecurityCP/AlarmInCfg/capabilities?format=json ........................................ 131
5.4.13 /ISAPI/SecurityCP/AlarmOutCfg/<ID>?format=json ............................................... 132
5.4.14 /ISAPI/SecurityCP/AlarmOutCfg/capabilities?format=json ..................................... 133
5.4.15 /ISAPI/SecurityCP/AlarmOutCfg?format=json ........................................................ 133
5.4.16 /ISAPI/SecurityCP/Configuration/capabilities?format=json .................................... 134
5.4.17 /ISAPI/SecurityCP/ControlAlarmChan?format=json ............................................... 134
5.4.18 /ISAPI/SecurityCP/ControlAlarmChan/capabilities?format=json ............................ 134
5.4.19 /ISAPI/SecurityCP/SetAlarmHostOut/capabilities?format=json ............................. 135
5.4.20 /ISAPI/SecurityCP/SetAlarmHostOut?format=json ................................................. 135
## 5.4.21
/ISAPI/System/PictureServer/capabilities?format=json ......................................... 135
5.4.22 /ISAPI/System/PictureServer?format=json ............................................................. 136
## 5.5 Schedule
Settings ............................................................................................................... 137
5.5.1 /ISAPI/AccessControl/CardReaderPlan/<CardReaderNo>?format=json ................... 137
## 5.5.2
/ISAPI/AccessControl/CardReaderPlan/capabilities?format=json ............................ 138
## 5.5.3
/ISAPI/AccessControl/UserRightHolidayPlanCfg/capabilities?format=json .............. 138
5.5.4 /ISAPI/AccessControl/UserRightWeekPlanCfg/capabilities?format=json ................. 139
## 5.5.5
/ISAPI/AccessControl/ClearPlansCfg/capabilities?format=json ................................ 139
5.5.6 /ISAPI/AccessControl/ClearPlansCfg?format=json .................................................... 139
5.5.7 /ISAPI/AccessControl/DoorStatusHolidayGroupCfg/<GroupNo>?format=json ........ 140
## 5.5.8
/ISAPI/AccessControl/DoorStatusHolidayGroupCfg/capabilities?format=json ......... 141
5.5.9 /ISAPI/AccessControl/DoorStatusHolidayPlanCfg/<PlanNo>?format=json .............. 141
5.5.10 /ISAPI/AccessControl/DoorStatusHolidayPlanCfg/capabilities?format=json .......... 142
5.5.11 /ISAPI/AccessControl/DoorStatusPlan/<DoorNo>?format=json ............................. 142
## 5.5.12
/ISAPI/AccessControl/DoorStatusPlan/capabilities?format=json ........................... 143
5.5.13 /ISAPI/AccessControl/DoorStatusPlanTemplate/<TemplateNo>?format=json ....... 143
Intelligent Security API (Access Control on Person) Developer Guide
viii

5.5.14 /ISAPI/AccessControl/DoorStatusPlanTemplate/capabilities?format=json ............ 144
5.5.15 /ISAPI/AccessControl/DoorStatusWeekPlanCfg/<PlanNo>?format=json ............... 144
## 5.5.16
/ISAPI/AccessControl/DoorStatusWeekPlanCfg/capabilities?format=json ............. 145
5.5.17 /ISAPI/AccessControl/UserRightHolidayGroupCfg/<GroupNo>?format=json ........ 146
5.5.18 /ISAPI/AccessControl/UserRightHolidayGroupCfg/capabilities?format=json ......... 146
5.5.19 /ISAPI/AccessControl/UserRightHolidayPlanCfg/<PlanNo>?format=json ............... 147
5.5.20 /ISAPI/AccessControl/UserRightPlanTemplate/<TemplateNo>?format=json ......... 148
5.5.21 /ISAPI/AccessControl/UserRightPlanTemplate/capabilities?format=json ............... 148
5.5.22 /ISAPI/AccessControl/UserRightWeekPlanCfg/<PlanNo>?format=json ................. 149
5.5.23 /ISAPI/AccessControl/VerifyHolidayGroupCfg/<GroupNo>?format=json ............... 150
5.5.24 /ISAPI/AccessControl/VerifyHolidayGroupCfg/capabilities?format=json ............... 151
5.5.25 /ISAPI/AccessControl/VerifyHolidayPlanCfg/<PlanNo>?format=json ..................... 151
## 5.5.26
/ISAPI/AccessControl/VerifyHolidayPlanCfg/capabilities?format=json .................. 152
5.5.27 /ISAPI/AccessControl/VerifyPlanTemplate/<TemplateNo>?format=json ............... 152
## 5.5.28
/ISAPI/AccessControl/VerifyPlanTemplate/capabilities?format=json ..................... 153
5.5.29 /ISAPI/AccessControl/VerifyWeekPlanCfg/<PlanNo>?format=json ........................ 153
## 5.5.30
/ISAPI/AccessControl/VerifyWeekPlanCfg/capabilities?format=json ..................... 154
5.6 Remote Control .................................................................................................................. 155
5.6.1 /ISAPI/AccessControl/RemoteControl/buzzer/<ID>?format=json ............................ 155
## 5.6.2
/ISAPI/AccessControl/RemoteControl/buzzer/capabilities?format=json ................. 155
5.6.3 /ISAPI/AccessControl/RemoteControl/door/<ID> .................................................... 156
## 5.6.4
/ISAPI/AccessControl/RemoteControl/door/capabilities .......................................... 156
## 5.6.5
/ISAPI/AccessControl/remoteControlPWCheck/capabilities?format=json ............... 156
5.6.6 /ISAPI/AccessControl/remoteControlPWCheck/door/<ID>?format=json ................. 157
5.7 Operation and Maintenance .............................................................................................. 157
## 5.7.1
/ISAPI/AccessControl/AcsWorkStatus/capabilities?format=json .............................. 157
5.7.2 /ISAPI/AccessControl/AcsWorkStatus?format=json .................................................. 158
## 5.7.3
/ISAPI/AccessControl/ClearAntiSneak/capabilities?format=json .............................. 158
Intelligent Security API (Access Control on Person) Developer Guide
ix

5.7.4 /ISAPI/AccessControl/ClearAntiSneak?format=json ................................................. 159
5.7.5 /ISAPI/AccessControl/ClearCardRecord .................................................................... 159
## 5.7.6
/ISAPI/AccessControl/ClearCardRecord/capabilities ................................................. 160
5.7.7 /ISAPI/AccessControl/ClearSubmarineBack .............................................................. 160
5.7.8 /ISAPI/AccessControl/ClearSubmarineBack/capabilities .......................................... 160
5.7.9 /ISAPI/AccessControl/DoorSecurityModule/moduleStatus ...................................... 161
5.7.10 /ISAPI/AccessControl/DoorSecurityModule/moduleStatus/capabilities ................ 161
5.7.11 /ISAPI/AccessControl/maintenanceData?secretkey= ............................................. 162
5.7.12 /ISAPI/AccessControl/OSDPStatus/<ID>?format=json ............................................ 162
5.7.13 /ISAPI/AccessControl/OSDPStatus/capabilities?format=json ................................. 163
5.7.14 /ISAPI/AccessControl/userData?secretkey= ........................................................... 163
5.8 Event Management ............................................................................................................ 165
## 5.8.1
/ISAPI/AccessControl/AcsEvent/capabilities?format=json ........................................ 165
5.8.2 /ISAPI/AccessControl/AcsEvent?format=json ........................................................... 165
## 5.8.3
/ISAPI/AccessControl/AcsEventTotalNum/capabilities?format=json ........................ 167
5.8.4 /ISAPI/AccessControl/AcsEventTotalNum?format=json ............................................ 167
## 5.8.5
/ISAPI/AccessControl/ClearEventCardLinkageCfg/capabilities?format=json ............ 168
5.8.6 /ISAPI/AccessControl/ClearEventCardLinkageCfg?format=json ................................ 168
5.8.7 /ISAPI/AccessControl/DeployInfo ............................................................................. 168
## 5.8.8
/ISAPI/AccessControl/DeployInfo/capabilities .......................................................... 169
5.8.9 /ISAPI/AccessControl/EventCardLinkageCfg/<ID>?format=json ............................... 169
## 5.8.10
/ISAPI/AccessControl/EventCardLinkageCfg/capabilities?format=json .................. 170
## 5.8.11
/ISAPI/AccessControl/EventCardNoList/capabilities?format=json .......................... 171
5.8.12 /ISAPI/AccessControl/EventCardNoList?format=json ............................................. 171
5.8.13 /ISAPI/AccessControl/EventOptimizationCfg/capabilities?format=json ................. 171
## 5.8.14
/ISAPI/AccessControl/EventOptimizationCfg?format=json ..................................... 172
5.9 Alarm or Event Receiving ................................................................................................... 172
## 5.9.1
/ISAPI/Event/notification/alertStream ...................................................................... 172
Intelligent Security API (Access Control on Person) Developer Guide
x

5.9.2 /ISAPI/Event/notification/httpHosts ......................................................................... 173
5.9.3 /ISAPI/Event/notification/httpHosts/<ID>/test ........................................................ 175
## 5.9.4
/ISAPI/Event/notification/httpHosts/capabilities ..................................................... 175
5.9.5 http://ipAddress:portNo/url ..................................................................................... 175
Chapter 6 Request and Response Message ............................................................................. 177
6.1 JSON Messages .................................................................................................................. 177
6.1.1 JSON_AcsCfg ............................................................................................................. 177
6.1.2 JSON_AcsEvent ......................................................................................................... 178
6.1.3 JSON_AcsEventCond ................................................................................................. 180
6.1.4 JSON_AcsEventTotalNum .......................................................................................... 181
6.1.5 JSON_AcsEventTotalNumCond .................................................................................. 181
6.1.6 JSON_AcsWorkStatus ................................................................................................ 182
6.1.7 JSON_AddFaceRecordCond ....................................................................................... 183
6.1.8 JSON_AddFaceRecordResult ..................................................................................... 186
6.1.9 JSON_AlarmInCfg ...................................................................................................... 186
6.1.10 JSON_AlarmOutCfg ................................................................................................. 188
6.1.11 JSON_AlarmOutCfgList ............................................................................................ 189
## 6.1.12
JSON_AntiSneakCfg ................................................................................................. 190
6.1.13 JSON_AttendanceStatusModeCfg ........................................................................... 190
## 6.1.14
JSON_AttendanceStatusRuleCfg ............................................................................. 190
6.1.15 JSON_Cap_AcsCfg ................................................................................................... 191
6.1.16 JSON_Cap_AcsEvent ............................................................................................... 192
6.1.17 JSON_Cap_AcsEventTotalNum ................................................................................ 197
6.1.18 JSON_Cap_AcsWorkStatus ...................................................................................... 199
6.1.19 JSON_Cap_AlarmInCfg ............................................................................................ 201
6.1.20 JSON_Cap_AlarmOutCfg ......................................................................................... 205
## 6.1.21
JSON_Cap_AntiSneakCfg ......................................................................................... 206
## 6.1.22
JSON_Cap_AttendanceStatusModeCfg ................................................................... 206
Intelligent Security API (Access Control on Person) Developer Guide
xi

6.1.23 JSON_Cap_AttendanceStatusRuleCfg ..................................................................... 207
6.1.24 JSON_Cap_CardInfo ................................................................................................ 208
## 6.1.25
JSON_Cap_CardReaderAntiSneakCfg ...................................................................... 210
6.1.26 JSON_Cap_CardReaderCfg ...................................................................................... 210
6.1.27 JSON_Cap_CardReaderPlan .................................................................................... 215
## 6.1.28
JSON_Cap_ClearAntiSneak ..................................................................................... 215
6.1.29 JSON_Cap_ClearAntiSneakCfg ................................................................................ 215
6.1.30 JSON_Cap_ClearEventCardLinkageCfg .................................................................... 216
6.1.31 JSON_Cap_ClearGroupCfg ...................................................................................... 216
6.1.32 JSON_Cap_ClearPlansCfg ........................................................................................ 216
6.1.33 JSON_Cap_ControlAlarmChan ................................................................................ 217
6.1.34 JSON_Cap_DoorStatusHolidayGroupCfg ................................................................. 217
6.1.35 JSON_Cap_DoorStatusHolidayPlanCfg .................................................................... 218
6.1.36 JSON_Cap_DoorStatusPlan ..................................................................................... 219
6.1.37 JSON_Cap_DoorStatusPlanTemplate ...................................................................... 219
6.1.38 JSON_Cap_DoorStatusWeekPlanCfg ....................................................................... 220
6.1.39 JSON_Cap_EventCardLinkageCfg ............................................................................ 221
6.1.40 JSON_Cap_EventCardNoList ................................................................................... 224
## 6.1.41
JSON_Cap_EventOptimizationCfg ........................................................................... 224
6.1.42 JSON_Cap_FaceRecognizeMode ............................................................................. 224
6.1.43 JSON_Cap_FingerPrintCfg ....................................................................................... 224
6.1.44 JSON_Cap_FingerPrintDelete .................................................................................. 226
6.1.45 JSON_Cap_GroupCfg ............................................................................................... 227
6.1.46 JSON_Cap_LogModeCfg .......................................................................................... 228
## 6.1.47
JSON_Cap_MultiCardCfg ......................................................................................... 228
## 6.1.48
JSON_Cap_MultiDoorInterLockCfg ......................................................................... 229
6.1.49 JSON_Cap_OSDPModify ......................................................................................... 230
6.1.50 JSON_Cap_OSDPStatus ........................................................................................... 230
Intelligent Security API (Access Control on Person) Developer Guide
xii

6.1.51 JSON_Cap_PhoneDoorRightCfg .............................................................................. 231
6.1.52 JSON_Cap_PictureServerInformation ..................................................................... 232
6.1.53 JSON_Cap_PrinterCfg .............................................................................................. 234
6.1.54 JSON_Cap_RemoteControlBuzzer ........................................................................... 236
6.1.55 JSON_Cap_RemoteControlPWCfg ........................................................................... 237
6.1.56 JSON_Cap_RemoteControlPWCheck ...................................................................... 237
6.1.57 JSON_Cap_SetAlarmHostOut .................................................................................. 237
## 6.1.58
JSON_Cap_SmsRelativeParam ................................................................................ 238
6.1.59 JSON_TTSTextCap .................................................................................................... 238
6.1.60 JSON_Cap_UserInfo ................................................................................................ 239
6.1.61 JSON_Cap_UserInfoDetail ....................................................................................... 244
6.1.62 JSON_Cap_UserRightHolidayGroupCfg ................................................................... 245
6.1.63 JSON_Cap_UserRightHolidayPlanCfg ...................................................................... 245
6.1.64 JSON_Cap_UserRightPlanTemplate ........................................................................ 246
6.1.65 JSON_Cap_UserRightWeekPlanCfg ......................................................................... 247
6.1.66 JSON_Cap_VerifyHolidayGroupCfg ......................................................................... 247
6.1.67 JSON_Cap_VerifyHolidayPlanCfg ............................................................................ 248
6.1.68 JSON_Cap_VerifyPlanTemplate ............................................................................... 249
6.1.69 JSON_Cap_VerifyWeekPlanCfg ............................................................................... 250
6.1.70 JSON_CardInfo ........................................................................................................ 251
## 6.1.71
JSON_CardInfo_Collection ...................................................................................... 252
6.1.72 JSON_CardInfoCap .................................................................................................. 252
6.1.73 JSON_CardInfoCount ............................................................................................... 252
6.1.74 JSON_CardInfoDelCond ........................................................................................... 253
6.1.75 JSON_CardInfoSearch ............................................................................................. 253
6.1.76 JSON_CardInfoSearchCond ..................................................................................... 254
## 6.1.77
JSON_CardReaderAntiSneakCfg .............................................................................. 254
6.1.78 JSON_CardReaderCfg .............................................................................................. 255
Intelligent Security API (Access Control on Person) Developer Guide
xiii

6.1.79 JSON_CardReaderPlan ............................................................................................ 257
6.1.80 JSON_ClearAntiSneak ............................................................................................. 257
## 6.1.81
JSON_ClearAntiSneakCfg ........................................................................................ 258
6.1.82 JSON_ClearEventCardLinkageCfg ............................................................................ 258
6.1.83 JSON_ClearGroupCfg .............................................................................................. 258
6.1.84 JSON_ClearPlansCfg ................................................................................................ 259
6.1.85 JSON_ControlAlarmChan ........................................................................................ 259
6.1.86 JSON_CreateFPLibCond .......................................................................................... 260
6.1.87 JSON_CreateFPLibResult ......................................................................................... 260
6.1.88 JSON_DelFaceRecord .............................................................................................. 260
6.1.89 JSON_DoorStatusHolidayGroupCfg ......................................................................... 261
6.1.90 JSON_DoorStatusHolidayPlanCfg ............................................................................ 261
6.1.91 JSON_DoorStatusPlan ............................................................................................. 262
6.1.92 JSON_DoorStatusPlanTemplate .............................................................................. 262
6.1.93 JSON_DoorStatusWeekPlanCfg ............................................................................... 262
6.1.94 JSON_EditFaceRecord ............................................................................................. 263
6.1.95 JSON_EditFPlibInfo .................................................................................................. 264
6.1.96 JSON_EventCardLinkageCfg .................................................................................... 264
6.1.97 JSON_EventCardNoList ........................................................................................... 265
## 6.1.98
JSON_EventNotificationAlert_AccessControlEventEg ............................................. 266
6.1.99 JSON_EventNotificationAlert_Alarm/EventInfo ...................................................... 271
## 6.1.100
JSON_EventNotificationAlert_UploadIDCardSwipingEvent .................................. 272
## 6.1.101
JSON_EventOptimizationCfg ................................................................................. 275
6.1.102 JSON_FaceRecognizeMode ................................................................................... 275
6.1.103 JSON_FaceRecordNumInAllFPLib .......................................................................... 275
6.1.104 JSON_FaceRecordNumInOneFPLib ....................................................................... 276
6.1.105 JSON_FingerPrintCfg ............................................................................................. 276
6.1.106 JSON_FingerPrintCond .......................................................................................... 277
Intelligent Security API (Access Control on Person) Developer Guide
xiv

6.1.107 JSON_FingerPrintCondAll ...................................................................................... 278
6.1.108 JSON_FingerPrintDelete ........................................................................................ 278
6.1.109 JSON_FingerPrintDeleteProcess ........................................................................... 279
6.1.110 JSON_FingerPrintInfo ............................................................................................ 279
6.1.111 JSON_FingerPrintInfoAll ........................................................................................ 279
6.1.112 JSON_FingerPrintModify ....................................................................................... 280
6.1.113 JSON_FingerPrintStatus ........................................................................................ 280
6.1.114 JSON_FPLibCap ..................................................................................................... 281
6.1.115 JSON_FPLibListInfo ................................................................................................ 282
6.1.116 JSON_GroupCfg ..................................................................................................... 283
## 6.1.117
JSON_HostConfigCap ............................................................................................ 283
6.1.118 JSON_LockType ..................................................................................................... 285
6.1.119 JSON_LockTypeCap ............................................................................................... 286
6.1.120 JSON_LogModeCfg ................................................................................................ 286
## 6.1.121
JSON_MultiCardCfg ............................................................................................... 286
6.1.122 JSON_MultiDoorInterLockCfg ............................................................................... 287
6.1.123 JSON_NFCCfg ........................................................................................................ 287
6.1.124 JSON_NFCCfgCap .................................................................................................. 288
6.1.125 JSON_OSDPModify ............................................................................................... 288
6.1.126 JSON_OSDPStatus ................................................................................................. 288
6.1.127 JSON_PhoneDoorRightCfg .................................................................................... 288
## 6.1.128
JSON_PictureServerInformation ........................................................................... 289
6.1.129 JSON_PrinterCfg .................................................................................................... 290
6.1.130 JSON_RemoteControlBuzzer ................................................................................. 291
6.1.131 JSON_RemoteControlPWCfg ................................................................................. 292
6.1.132 JSON_RemoteControlPWCheck ............................................................................ 292
6.1.133 JSON_ResponseStatus ........................................................................................... 292
6.1.134 JSON_RFCardCfg ................................................................................................... 293
Intelligent Security API (Access Control on Person) Developer Guide
xv

6.1.135 JSON_RFCardCfgCap ............................................................................................. 293
6.1.136 JSON_SearchFaceRecordCond .............................................................................. 293
6.1.137 JSON_SearchFaceRecordResult ............................................................................. 294
6.1.138 JSON_SetAlarmHostOut ........................................................................................ 296
6.1.139 JSON_SetFaceRecord ............................................................................................ 296
6.1.140 JSON_SingleFPLibInfo ............................................................................................ 297
## 6.1.141
JSON_SmsRelativeParam ...................................................................................... 297
6.1.142 JSON_TTSText ........................................................................................................ 298
6.1.143 JSON_UserInfo ...................................................................................................... 299
6.1.144 JSON_UserInfoCount ............................................................................................. 301
6.1.145 JSON_UserInfoDelCond ........................................................................................ 301
6.1.146 JSON_UserInfoDetail ............................................................................................. 301
6.1.147 JSON_UserInfoDetailDeleteProcess ...................................................................... 302
6.1.148 JSON_UserInfoSearch ........................................................................................... 302
6.1.149 JSON_UserInfoSearchCond ................................................................................... 304
6.1.150 JSON_UserRightHolidayGroupCfg ......................................................................... 304
6.1.151 JSON_UserRightHolidayPlanCfg ............................................................................ 305
6.1.152 JSON_UserRightPlanTemplate .............................................................................. 305
6.1.153 JSON_UserRightWeekPlanCfg ............................................................................... 306
6.1.154 JSON_VerifyHolidayGroupCfg ............................................................................... 306
6.1.155 JSON_VerifyHolidayPlanCfg .................................................................................. 306
6.1.156 JSON_VerifyPlanTemplate ..................................................................................... 307
6.1.157 JSON_VerifyWeekPlanCfg ..................................................................................... 308
6.2 XML Messages ................................................................................................................... 308
6.2.1 XML_CaptureFaceData .............................................................................................. 308
6.2.2 XML_CaptureFaceDataCond ..................................................................................... 309
6.2.3 XML_CaptureFingerPrint ........................................................................................... 309
6.2.4 XML_CaptureFingerPrintCond .................................................................................. 309
Intelligent Security API (Access Control on Person) Developer Guide
xvi

6.2.5 XML_Cap_AccessControl .......................................................................................... 309
6.2.6 XML_Cap_CaptureFaceData ..................................................................................... 317
6.2.7 XML_Cap_CaptureFingerPrint .................................................................................. 317
6.2.8 XML_Cap_ClearCardRecord ...................................................................................... 318
6.2.9 XML_Cap_ClearSubmarineBack ................................................................................ 318
6.2.10 XML_Cap_DeployInfo ............................................................................................. 319
6.2.11 XML_Cap_DoorParam ............................................................................................. 319
6.2.12 XML_Cap_FaceCompareCond ................................................................................. 321
6.2.13 XML_Cap_IDBlackListCfg ......................................................................................... 321
## 6.2.14
XML_Cap_IdentityTerminal ..................................................................................... 322
6.2.15 XML_Cap_M1CardEncryptCfg ................................................................................. 323
6.2.16 XML_Cap_ModuleStatus ......................................................................................... 323
6.2.17 XML_Cap_ReaderAcrossHost .................................................................................. 323
6.2.18 XML_Cap_RemoteControlDoor ............................................................................... 324
6.2.19 XML_Cap_ServerDevice .......................................................................................... 324
## 6.2.20
XML_Cap_SnapConfig ............................................................................................. 324
6.2.21 XML_Cap_StartReaderInfo ...................................................................................... 325
6.2.22 XML_Cap_SubmarineBack ...................................................................................... 325
6.2.23 XML_Cap_SubmarineBackHostInfo ........................................................................ 325
6.2.24 XML_Cap_SubmarineBackMode ............................................................................. 325
6.2.25 XML_Cap_SubmarineBackReader ........................................................................... 326
6.2.26 XML_Cap_WiegandCfg ............................................................................................ 326
6.2.27 XML_Cap_WiegandRuleCfg ..................................................................................... 326
6.2.28 XML_ClearCardRecord ............................................................................................ 328
6.2.29 XML_ClearSubmarineBack ...................................................................................... 329
6.2.30 XML_DeployInfo ...................................................................................................... 329
6.2.31 XML_DoorParam ..................................................................................................... 330
6.2.32 XML_EventCap ........................................................................................................ 331
Intelligent Security API (Access Control on Person) Developer Guide
xvii

6.2.33 XML_EventNotificationAlert_HeartbeatInfo ........................................................... 333
6.2.34 XML_EventNotificationAlert_AlarmEventInfo ......................................................... 334
6.2.35 XML_EventTrigger ................................................................................................... 334
6.2.36 XML_EventTriggerCapType ..................................................................................... 335
6.2.37 XML_EventTriggerList .............................................................................................. 337
## 6.2.38
XML_EventTriggerNotification ................................................................................ 341
6.2.39 XML_EventTriggerNotificationList ........................................................................... 342
6.2.40 XML_EventTriggersCap ........................................................................................... 342
6.2.41 XML_FaceCompareCond ......................................................................................... 344
6.2.42 XML_HttpHostNotification ...................................................................................... 345
6.2.43 XML_HttpHostNotificationCap ................................................................................ 346
6.2.44 XML_HttpHostNotificationList ................................................................................ 347
## 6.2.45
XML_HttpHostTestResult ........................................................................................ 348
6.2.46 XML_IDBlackListCfg ................................................................................................. 348
## 6.2.47
XML_IdentityTerminal ............................................................................................. 348
6.2.48 XML_M1CardEncryptCfg ......................................................................................... 350
6.2.49 XML_ModuleStatus ................................................................................................. 350
6.2.50 XML_ReaderAcrossHost .......................................................................................... 350
6.2.51 XML_ResponseStatus .............................................................................................. 350
## 6.2.52
XML_ResponseStatus_AuthenticationFailed .......................................................... 351
6.2.53 XML_RemoteControlDoor ....................................................................................... 351
6.2.54 XML_ServerDevice .................................................................................................. 352
## 6.2.55
XML_SnapConfig ..................................................................................................... 352
6.2.56 XML_StartReaderInfo .............................................................................................. 352
6.2.57 XML_SubmarineBack .............................................................................................. 353
6.2.58 XML_SubmarineBackHostInfo ................................................................................ 353
6.2.59 XML_SubmarineBackMode ..................................................................................... 353
6.2.60 XML_SubmarineBackReader ................................................................................... 353
Intelligent Security API (Access Control on Person) Developer Guide
xviii

6.2.61 XML_WiegandCfg .................................................................................................... 354
6.2.62 XML_WiegandRuleCfg ............................................................................................. 354
Appendix A. Appendixes ......................................................................................................... 357
A.1 Access Control Event Types ............................................................................................... 357
A.2 Event Linkage Types ........................................................................................................... 373
A.3 Error Codes in ResponseStatus .......................................................................................... 385
Intelligent Security API (Access Control on Person) Developer Guide
xix

## Chapter 1 Overview
Access Control is the selective restriction of access to a place or other resources. The access control
applications integrated by Intelligent Security API (ISAPI) in this manual take the person as the
management and control unit, which indicates that linking fingerprints, faces, and other attributes
to a card will be replaced by linking fingerprints, cards, and other attributes to a person.
## 1.1 Introduction
This manual mainly introduces the integration flows and related URIs for access controller,
fingerprint access control terminal, fingerprint time attendance terminal, and so on, to implement
the following functions: schedule configuration, person/card/fingerprint information management,
alarm/event
configuration, door/elevator/buzzer control, anti-passing back, and so on.
## 1.2 Update History
Summary of Changes in Version 2.6_Feb., 2020
Related Product: DS-K1T804A Series and DS-K1T8003 Series Fingerprint Access Control Terminal
with Software Version 1.3.0; DS-K1A802A Series and DS-K1A8503 Series Fingerprint Time
Attendance Terminal with Software Version 1.3.0
1.Extended person management capability message JSON_Cap_UserInfo (related URI:
## /ISAPI/
AccessControl/UserInfo/capabilities?format=json ):
added a node purePwdVerifyEnable (whether the device supports opening the door only by
password).
2.Extended message about week schedule
configuration capability of card reader authentication
mode JSON_Cap_VerifyWeekPlanCfg (related URI: /ISAPI/AccessControl/VerifyWeekPlanCfg/
capabilities?format=json
## ):
added a node purePwdVerifyEnable (whether the device supports opening the door only by
password).
3.Extended message about holiday schedule
configuration capability of card reader
authentication mode JSON_Cap_VerifyHolidayPlanCfg (related URI: /ISAPI/AccessControl/
VerifyHolidayPlanCfg/capabilities?format=json
## ):
added a node purePwdVerifyEnable (whether the device supports opening the door only by
password).
4.Extended
configuration capability message of event and card linkage
JSON_Cap_EventCardLinkageCfg (related URI:
/ISAPI/AccessControl/EventCardLinkageCfg/
capabilities?format=json
## ):
added a node purePwdVerifyEnable (whether the device supports opening the door only by
password).
Intelligent Security API (Access Control on Person) Developer Guide
## 1

5.Extended condition message of searching for access control events JSON_AcsEventCond
(related URI: /ISAPI/AccessControl/AcsEvent?format=json ):
added a node timeReverseOrder (whether to return events in descending order of time).
6.Extended capability message of searching for access control events JSON_Cap_AcsEvent
(related URI:
/ISAPI/AccessControl/AcsEvent/capabilities?format=json ):
added a sub node
timeReverseOrder (whether to return events in descending order of time) to
the node AcsEventCond.
7.Extended message about access control event information
JSON_EventNotificationAlert_AccessControlEventEg
## :
added a sub node purePwdVerifyEnable (whether the device supports opening the door only
by password) to the node AccessControllerEvent.
8.Extended
configuration capability message JSON_Cap_CardReaderCfg and parameter message
JSON_CardReaderCfg of card reader (related URIs: /ISAPI/AccessControl/CardReaderCfg/
capabilities?format=json
and /ISAPI/AccessControl/CardReaderCfg/<ID>?format=json ):
added two nodes: FPAlgorithmVersion (fingerprint algorithm library version) and
cardReaderVersion (card reader version).
Summary of Changes in Version 2.6_Jan., 2020
Related Product: DS-K1T341AM, DS-K1T341AMF, DS-K1T642M, DS-K1T642MF, DS-K1T642E, DS-
K1T642EF, DS-K1T642MW, DS-K1T642MFW, DS-K1T642EW, and DS-K1T642EFW Face
## Recognition
Terminal with Software Version 1.0
1.Extended person
information message JSON_UserInfo (related URIs: /ISAPI/AccessControl/
UserInfo/Record?format=json , /ISAPI/AccessControl/UserInfo/Modify?format=json , and /
ISAPI/AccessControl/UserInfo/SetUp?format=json ):
added two nodes: gender (gender of the person in the face picture) and PersonInfoExtends
(person extension
information).
2.Extended result message of searching for person information JSON_UserInfoSearch (related
URI: /ISAPI/AccessControl/UserInfo/Search?format=json ):
added two sub nodes: gender (gender of the person in the face picture) and PersonInfoExtends
(person extension
information) to the node UserInfo.
3.Extended person management capability message JSON_Cap_UserInfo (related URI: /ISAPI/
AccessControl/UserInfo/capabilities?format=json
## ):
added a sub node fuzzySearch (keywords for fuzzy search) to the node UserInfoSearchCond;
added two nodes: gender (gender of the person in the face picture) and PersonInfoExtends
(person extension
information).
4.Added a URI of exporting or importing person permission data securely: GET or POST /ISAPI/
AccessControl/userData?secretkey= .
5.Added a URI of
exporting the maintenance data: GET /ISAPI/AccessControl/maintenanceData?
secretkey= .
6.Added two URIs of
configuring text parameters of the audio prompt for authentication results:
## Get
configuration capability: GET /ISAPI/AccessControl/Verification/ttsText/capabilities?
format=json ;
Get or set parameters: GET or PUT
/ISAPI/AccessControl/Verification/ttsText?format=json .
Intelligent Security API (Access Control on Person) Developer Guide
## 2

7.Extended configuration capability message JSON_Cap_AcsCfg and parameter message
JSON_AcsCfg of the access controller (related URIs: /ISAPI/AccessControl/AcsCfg/capabilities?
format=json and /ISAPI/AccessControl/AcsCfg?format=json ):
added three nodes: showPicture (whether to display the
authenticated picture),
showEmployeeNo (whether to display the
authenticated employee ID), and showName
(whether to display the
authenticated name).
8.Extended condition configuration capability XML_Cap_FaceCompareCond and condition
parameter message XML_FaceCompareCond of face picture comparison (related URIs: /ISAPI/
AccessControl/FaceCompareCond/capabilities
and /ISAPI/AccessControl/FaceCompareCond ):
added a node <maxDistance> (maximum recognition distance).
9.Added two URIs of
configuring door lock status when the device is powered off:
Get configuration capability: GET /ISAPI/AccessControl/Configuration/lockType/capabilities?
format=json ;
Get or set parameters: GET or PUT
/ISAPI/AccessControl/Configuration/lockType?
format=json .
10.Extended
functional capability message of access control XML_Cap_AccessControl (related
URI: /ISAPI/AccessControl/capabilities ):
added six nodes: <isSupportTTSText> (whether it supports configuring the text of the audio
prompt), <isSupportIDBlackListCfg> (whether it supports applying ID card blacklist),
<isSupportUserDataImport> (whether it supports
importing person permission data),
<isSupportUserDataExport> (whether it supports
exporting person permission data),
<isSupportMaintenanceDataExport> (whether it supports
exporting maintenance data), and
<isSupportLockTypeCfg> (whether it supports
configuring door lock status when the device is
powered
off).
Summary of Changes in Version 2.0_Aug., 2019
Related Product: DS-K1T640 Series, DS-K1T671 Series, and DS-K5671 Series Face Recognition
Terminal with Software Version 2.1.1
1.Extended the capability message of
collecting face data XML_Cap_CaptureFaceData (related
## URI:
/ISAPI/AccessControl/CaptureFaceData/capabilities ):
added a sub node <dataType> (data type of collected face pictures) to the node
<CaptureFaceDataCond>.
2.Extended the
condition message of collecting face data XML_CaptureFaceDataCond (related
URI: /ISAPI/AccessControl/CaptureFaceData ):
added a node <dataType> (data type of collected face pictures).
3.Added a URI of
getting or setting parameters of multiple alarm outputs in a batch: GET or PUT /
ISAPI/SecurityCP/AlarmOutCfg?format=json .
4.Extended the
configuration capability message of alarm outputs JSON_Cap_AlarmOutCfg
(related URI:
/ISAPI/SecurityCP/AlarmOutCfg/capabilities?format=json ):
added a node maxSize (maximum number of alarm outputs that can be configured in a batch).
Intelligent Security API (Access Control on Person) Developer Guide
## 3

Summary of Changes in Version 2.0_July, 2019
Related Products: DS-K1A802 Series, DS-K1A802A Series, and DS-K1A8503 Series Fingerprint Time
Attendance Terminal; DS-K1T804 Series, DS-K1T8003 Series, and DS-K1T8004 Series Fingerprint
## Access Control Terminal.
1.Extended person management capability message JSON_Cap_UserInfo and person
information
message JSON_UserInfo (related URIs: /ISAPI/AccessControl/UserInfo/capabilities?
format=json , /ISAPI/AccessControl/UserInfo/Record?format=json , and /ISAPI/AccessControl/
UserInfo/Modify?format=json ):
added a node addUser (whether to add the person if the person
information being edited does
not exist);
added a person
authentication mode "cardOrFpOrPw" (card or fingerprint or password) to the
node userVerifyMode.
2.Extended person information search result message JSON_UserInfoSearch (related URI: /ISAPI/
AccessControl/UserInfo/Search?format=json ):
added a person
authentication mode "cardOrFpOrPw" (card or fingerprint or password) to the
sub node userVerifyMode of the node UserInfo (person
information).
3.Extended card information capability message JSON_Cap_CardInfo and card information
message JSON_CardInfo (related URIs: /ISAPI/AccessControl/CardInfo/capabilities?
format=json
and /ISAPI/AccessControl/CardInfo/Modify?format=json ):
added a node addCard (whether to add the card if the card
information being edited does not
exist).
4.Extended capability message XML_Cap_RemoteControlDoor and parameter message
XML_RemoteControlDoor of remotely controlling the door or elevator (related URIs:
## /ISAPI/
AccessControl/RemoteControl/door/capabilities
and /ISAPI/AccessControl/RemoteControl/
door/<ID> ):
added a node <password> (password for opening door).
5.Extended week schedule
configuration capability message JSON_Cap_VerifyWeekPlanCfg and
week schedule parameter message JSON_VerifyWeekPlanCfg of the card reader authentication
mode (related URIs: /ISAPI/AccessControl/VerifyWeekPlanCfg/capabilities?format=json and /
ISAPI/AccessControl/VerifyWeekPlanCfg/<PlanNo>?format=json ):
added an
authentication mode "cardOrFpOrPw" (card or fingerprint or password) to the sub
node verifyMode of the node WeekPlanCfg (week schedule parameters).
6.Extended holiday schedule
configuration capability message JSON_Cap_VerifyHolidayPlanCfg
and holiday schedule parameter message JSON_VerifyHolidayPlanCfg of the card reader
authentication mode (related URIs: /ISAPI/AccessControl/VerifyHolidayPlanCfg/capabilities?
format=json
and /ISAPI/AccessControl/VerifyHolidayPlanCfg/<PlanNo>?format=json ):
added an authentication mode "cardOrFpOrPw" (card or fingerprint or password) to the sub
node verifyMode of the node HolidayPlanCfg (holiday schedule parameters).
7.Extended
condition message of searching for access control events JSON_AcsEventCond
(related URI: /ISAPI/AccessControl/AcsEvent?format=json ):
added a node
eventAttribute (event attribute).
Intelligent Security API (Access Control on Person) Developer Guide
## 4

8.Extended result message of searching for access control events JSON_AcsEvent (related URI: /
ISAPI/AccessControl/AcsEvent?format=json ):
added two sub nodes: attendanceStatus (attendance status) and statusValue (status value) to
the node InfoList (event details);
added an authentication mode "cardOrFpOrPw" (card or fingerprint or password) to the sub
node currentVerifyMode of the node InfoList (event details).
9.Extended capability message of searching for access control events JSON_Cap_AcsEvent
(related URI:
/ISAPI/AccessControl/AcsEvent/capabilities?format=json ):
added a sub node
eventAttribute (event attribute) to the node AcsEventCond (search
conditions);
added two sub nodes: attendanceStatus (attendance status) and statusValue (status value) to
the node InfoList (event details);
added an authentication mode "cardOrFpOrPw" (card or fingerprint or password) to the sub
node currentVerifyMode of the node InfoList (event details).
10.Extended
condition message of getting the total number of access control events by conditions
JSON_AcsEventTotalNumCond (related URI: /ISAPI/AccessControl/AcsEventTotalNum?
format=json ):
added a node eventAttribute (event attribute).
11.Extended capability message of getting the total number of the access control events by
conditions JSON_Cap_AcsEventTotalNum (related URI: /ISAPI/AccessControl/
AcsEventTotalNum/capabilities?format=json
## ):
added a sub node
eventAttribute (event attribute) to the node AcsEventTotalNumCond
## (search
conditions).
12.Extended message of access control event information
JSON_EventNotificationAlert_AccessControlEventEg
## :
added two sub nodes: attendanceStatus (attendance status) and statusValue (status value) to
the node AccessControllerEvent;
added an
authentication mode "cardOrFpOrPw" (card or fingerprint or password) to the sub
node currentVerifyMode of the node AccessControllerEvent.
13.Extended capability message of
getting working status of access controller
JSON_Cap_AcsWorkStatus and working status message of access controller
JSON_AcsWorkStatus (related URIs:
/ISAPI/AccessControl/AcsWorkStatus/capabilities?
format=json
and /ISAPI/AccessControl/AcsWorkStatus?format=json ):
added an authentication mode 27 (card or fingerprint or password) to the node
cardReaderVerifyMode.
14.Extended door
(floor) configuration capability message XML_Cap_DoorParam and door (floor)
parameter message XML_DoorParam (related URIs: /ISAPI/AccessControl/Door/param/<ID>/
capabilities
and /ISAPI/AccessControl/Door/param/<ID> ):
added a node <remoteControlPWStatus> (whether the password has been
configured for
remote door control).
15.Added the
function of configuring attendance status, refer to Configure Attendance Status for
details.
Intelligent Security API (Access Control on Person) Developer Guide
## 5

16.Added the function of configuring password for remote door control, refer to Configure
Password for Remote Door Control for details.
17.Added the function of collecting card information, refer to Collect Card Information for details.
18.Extended access control capability message XML_Cap_AccessControl (related URI:
## /ISAPI/
AccessControl/capabilities
## ):
added
five nodes: <isSupportRemoteControlPWChcek> (whether to support verifying the
password for remote door control), <isSupportRemoteControlPWCfg> (whether to support
configuring password for remote door control), <isSupportAttendanceStatusModeCfg>
(whether to support
configuring attendance mode), <isSupportAttendanceStatusRuleCfg>
(whether to support configuring attendance status and rule), and <isSupportCaptureCardInfo>
(whether to support
collecting card information).
19.Extended the access control event types in Access Control Event Types :
added six event types to MAJOR_EVENT: "MINOR_LOCAL_UPGRADE_FAIL" (Local Upgrade
Failed), "MINOR_REMOTE_UPGRADE_FAIL" (Remote Upgrade Failed),
"MINOR_REMOTE_EXTEND_MODULE_UPGRADE_SUCC" (Extension Module is Remotely
Upgraded), "MINOR_REMOTE_EXTEND_MODULE_UPGRADE_FAIL" (Upgrading Extension
Module Remotely Failed), "MINOR_REMOTE_FINGER_PRINT_MODULE_UPGRADE_SUCC"
(Fingerprint Module is Remotely Upgraded), and
"MINOR_REMOTE_FINGER_PRINT_MODULE_UPGRADE_FAIL" (Upgrading Fingerprint Module
## Remotely Failed).
Summary of Changes in Version 2.0_July, 2019
Related Products: DS-K1T804 Series Fingerprint Access Control Terminal.
1.Added the URIs to enable or disable NFC (Near-Field Communication) function:
Get the configuration capability: GET /ISAPI/AccessControl/Configuration/NFCCfg/capabilities?
format=json
## ;
Get parameters: GET
/ISAPI/AccessControl/Configuration/NFCCfg?format=json ;
Set parameters: PUT
/ISAPI/AccessControl/Configuration/NFCCfg?format=json .
2.Added the URIs to enable or disable RF (Radio Frequency) card
recognition:
Get the configuration capability: GET /ISAPI/AccessControl/Configuration/RFCardCfg/
capabilities?format=json
## ;
Get parameters: GET
/ISAPI/AccessControl/Configuration/RFCardCfg?format=json ;
Set parameters: PUT
/ISAPI/AccessControl/Configuration/RFCardCfg?format=json .
3.Extended access control capability message XML_Cap_AccessControl (related URI: /ISAPI/
AccessControl/capabilities
## ):
added two nodes: <isSupportNFCCfg> (whether the device supports enabling or disabling NFC
function) and <isSupportRFCardCfg> (whether the device supports enabling or disabling RF card
recognition).
4.Extended the access control event types in Access Control Event Types :
added four operation event types to MAJOR_OPERATION:
"MINOR_M1_CARD_ENCRYPT_VERIFY_OPEN" (M1 Card
## Encryption Verification Enabled),
"MINOR_M1_CARD_ENCRYPT_VERIFY_CLOSE" (M1 Card
## Encryption Verification Disabled),
Intelligent Security API (Access Control on Person) Developer Guide
## 6

"MINOR_NFC_FUNCTION_OPEN" (Opening Door with NFC Card Enabled), and
"MINOR_NFC_FUNCTION_CLOSE" (Opening Door with NFC Card Disabled);
added eight event types to MAJOR_EVENT: "MINOR_INFORMAL_MIFARE_CARD_VERIFY_FAIL"
(Authentication Failed: Invalid Mifare Card), "MINOR_CPU_CARD_ENCRYPT_VERIFY_FAIL"
(Verifying CPU Card
Encryption Failed), "MINOR_NFC_DISABLE_VERIFY_FAIL" (Disabling NFC
Verification Failed), "MINOR_EM_CARD_RECOGNIZE_NOT_ENABLED" (EM Card Recognition
Disabled), "MINOR_M1_CARD_RECOGNIZE_NOT_ENABLED" (M1 Card Recognition Disabled),
"MINOR_CPU_CARD_RECOGNIZE_NOT_ENABLED" (CPU Card Recognition Disabled),
"MINOR_ID_CARD_RECOGNIZE_NOT_ENABLED" (ID Card
Recognition Disabled), and
"MINOR_CARD_SET_SECRET_KEY_FAIL" (Importing Key to Card Failed).
5.Extended the event linkage types in Event Linkage Types :
added eight event linkage types of the
authentication unit:
"EVENT_ACS_INFORMAL_MIFARE_CARD_VERIFY_FAIL" (Authentication Failed: Invalid Mifare
Card), "EVENT_ACS_CPU_CARD_ENCRYPT_VERIFY_FAIL" (Verifying CPU Card
## Encryption Failed),
"EVENT_ACS_NFC_DISABLE_VERIFY_FAIL" (Disabling NFC Verification Failed),
"EVENT_ACS_EM_CARD_RECOGNIZE_NOT_ENABLED" (EM Card
## Recognition Disabled),
"EVENT_ACS_M1_CARD_RECOGNIZE_NOT_ENABLED" (M1 Card Recognition Disabled),
"EVENT_ACS_CPU_CARD_RECOGNIZE_NOT_ENABLED" (CPU Card Recognition Disabled),
"EVENT_ACS_ID_CARD_RECOGNIZE_NOT_ENABLED" (ID Card Recognition Disabled), and
## "EVENT_ACS_CARD_SET_SECRET_KEY_FAIL"
(Importing Key to Card Failed).
Summary of Changes in Version 2.0_June, 2019
Related Products: DS-K1T607 Series, DS-K1T610 Series, and DS-K5607 Series Face Recognition
Terminal in Version 1.1
1.Extended picture storage server capability message
JSON_Cap_PictureServerInformation and
picture storage server parameter message
JSON_PictureServerInformation (related URIs: /
ISAPI/System/PictureServer/capabilities?format=json
and /ISAPI/System/PictureServer?
format=json ):
added a sub node cloudPoolIdEx (cloud storage pool ID) to the node cloudStorage (parameters
of the cloud storage server).
2.Extended person management capability message JSON_Cap_UserInfo (related URI:
## /ISAPI/
AccessControl/UserInfo/capabilities?format=json
## ):
added a sub node searchID (search ID) to the node UserInfoSearchCond (search
conditions);
added a node maxRecordNum (supported maximum number of records (person records)).
3.Extended card
information capability message JSON_Cap_CardInfo (related URI: /ISAPI/
AccessControl/CardInfo/capabilities?format=json ):
added a sub node searchID (search ID) to the node CardInfoSearchCond (search
conditions);
added a node maxRecordNum (supported maximum number of records (card records)).
4.Extended
fingerprint configuration capability message JSON_Cap_FingerPrintCfg (related URI: /
ISAPI/AccessControl/FingerPrintCfg/capabilities?format=json ):
added a node searchID (search ID).
Intelligent Security API (Access Control on Person) Developer Guide
## 7

5.Added the function of managing face information (including creating face picture library,
managing face records in the face picture library, and configuring facial recognition mode), refer
to Manage Face Information for details.
6.Extended
fingerprint and card reader configuration capability message
JSON_Cap_CardReaderCfg and
fingerprint and card reader parameter message
JSON_CardReaderCfg (related URIs:
/ISAPI/AccessControl/CardReaderCfg/capabilities?
format=json and /ISAPI/AccessControl/CardReaderCfg/<ID>?format=json ):
added two authentication modes: "cardOrFace" (card or face) and "cardOrFaceOrFp" (card or
face or
fingerprint) to the node defaultVerifyMode (default authentication mode of the
fingerprint and card reader);
added a node faceRecogizeEnable (whether to enable facial
recognition).
7.Extended configuration capability message of intelligent identity recognition terminal
XML_Cap_IdentityTerminal and parameter message of intelligent identity recognition terminal
XML_IdentityTerminal (related URIs: /ISAPI/AccessControl/IdentityTerminal/capabilities and /
ISAPI/AccessControl/IdentityTerminal ):
added a node <readCardRule> (card No.
setting rule).
8.Extended access control capability message XML_Cap_AccessControl (related URI: /ISAPI/
AccessControl/capabilities ):
added three nodes: <isSupportCaptureFace> (whether to support collecting face pictures),
<isSupportCaptureInfraredFace> (whether to support
collecting infrared face pictures), and
<isSupportFaceRecognizeMode> (whether to support
configuring facial recognition mode).
Summary of Changes in Version 2.0_May, 2019
Related Products: DS-K2600 Series Access Controller in Version 2.1.0
1.Extended person
information message JSON_UserInfo and person information search result
message JSON_UserInfoSearch (related URIs: /ISAPI/AccessControl/UserInfo/Record?
format=json , /ISAPI/AccessControl/UserInfo/Search?format=json , and /ISAPI/AccessControl/
UserInfo/Modify?format=json ):
added 11 person
authentication modes "faceOrFpOrCardOrPw" (face or fingerprint or card or
password), "faceAndFp"
(face+fingerprint), "faceAndPw" (face+password), "faceAndCard" (face
+card), "face" (face), "faceAndFpAndCard"
(face+fingerprint+card), "faceAndPwAndFp" (face
## +password+fingerprint),
"employeeNoAndFace" (employee No.+face), "faceOrfaceandCard"
(face or face+card), "fpOrface"
(fingerprint or face), "cardOrfaceOrPw" (card or face or
password) to the sub node userVerifyMode in the node UserInfo.
2.Added a URI to set person
information: PUT /ISAPI/AccessControl/UserInfo/SetUp?
format=json .
3.Extended person management capability message JSON_Cap_UserInfo (related URI:
## /ISAPI/
AccessControl/UserInfo/capabilities?format=json
## ):
added a
function type "setUp" (set person information) to the node supportFunction;
added two sub nodes timeRangeBegin (start time that can be configured) and timeRangeEnd
(end time that can be configured) to the node Valid.
4.Extended card
information message JSON_CardInfo (related URI: /ISAPI/AccessControl/
CardInfo/Record?format=json ):
Intelligent Security API (Access Control on Person) Developer Guide
## 8

add a node checkEmployeeNo (whether to check the existence of the employee No. (person
## ID)).
5.Added a URI to set card information: PUT /ISAPI/AccessControl/CardInfo/SetUp?format=json .
6.Extended card
information capability message JSON_Cap_CardInfo (related URI: /ISAPI/
AccessControl/CardInfo/capabilities?format=json
## ):
added a
function type "setUp" (set card information) to the node supportFunction;
added a node checkEmployeeNo (whether to check the existence of the employee No. (person
## ID)).
7.Added a URI to set
fingerprint parameters: PUT /ISAPI/AccessControl/FingerPrint/SetUp?
format=json .
8.Extended parameter message of door control week schedule JSON_DoorStatusWeekPlanCfg
(related URI: /ISAPI/AccessControl/DoorStatusWeekPlanCfg/<PlanNo>?format=json ):
add two door status "sleep" and "invalid" to the sub node doorStatus in the node WeekPlanCfg.
9.Extended
configuration capability message of door control week schedule
JSON_Cap_DoorStatusWeekPlanCfg (related URI: /ISAPI/AccessControl/
DoorStatusWeekPlanCfg/capabilities?format=json
## ):
added two door status "sleep" and "invalid" to the sub node doorStatus in the node
WeekPlanCfg;
add a sub node validUnit (time accuracy) to the node TimeSegment in the node WeekPlanCfg.
10.Extended week schedule parameter message of the card reader
authentication mode
JSON_VerifyWeekPlanCfg (related URI: /ISAPI/AccessControl/VerifyWeekPlanCfg/<PlanNo>?
format=json ):
added two
authentication modes "sleep" and "invalid" to the sub node verifyMode in the
node WeekPlanCfg.
11.Extended week schedule
configuration capability of the card reader authentication mode
JSON_Cap_VerifyWeekPlanCfg (related URI: /ISAPI/AccessControl/VerifyWeekPlanCfg/
capabilities?format=json
## ):
added two authentication modes "sleep" and "invalid" to the sub node verifyMode in the
node WeekPlanCfg;
added a sub node validUnit
(time accuracy) to the node TimeSegment in the node
WeekPlanCfg.
12.Extended parameter message of door control holiday schedule
JSON_DoorStatusHolidayPlanCfg (related URI: /ISAPI/AccessControl/
DoorStatusHolidayPlanCfg/<PlanNo>?format=json ):
add two door status "sleep" and "invalid" to the sub node doorStatus in the node
HolidayPlanCfg.
13.Extended
configuration capability message of door control holiday schedule
JSON_Cap_DoorStatusHolidayPlanCfg (related URI:
/ISAPI/AccessControl/
DoorStatusHolidayPlanCfg/capabilities?format=json
## ):
added two door status "sleep" and "invalid" to the sub node doorStatus in the node
HolidayPlanCfg;
add a sub node validUnit
(time accuracy) to the node TimeSegment in the node
HolidayPlanCfg.
Intelligent Security API (Access Control on Person) Developer Guide
## 9

14.Extended holiday schedule parameter message of the card reader authentication mode
JSON_VerifyHolidayPlanCfg (related URI: /ISAPI/AccessControl/VerifyHolidayPlanCfg/
<PlanNo>?format=json ):
added two
authentication modes "sleep" and "invalid" to the sub node verifyMode in the
node HolidayPlanCfg.
15.Extended holiday schedule configuration capability of the card reader authentication mode
JSON_Cap_VerifyHolidayPlanCfg (related URI: /ISAPI/AccessControl/VerifyHolidayPlanCfg/
capabilities?format=json ):
added two
authentication modes "sleep" and "invalid" to the sub node verifyMode in the
node HolidayPlanCfg;
added a sub node validUnit
(time accuracy) to the node TimeSegment in the node
HolidayPlanCfg.
16.Added the URIs to get the list of event and card linkage ID:
Get the capability of the list of event and card linkage ID: GET
/ISAPI/AccessControl/
EventCardNoList/capabilities?format=json ;
Get the list of event and card linkage ID: GET /ISAPI/AccessControl/EventCardNoList?
format=json .
17.Added the URI to get the capability of clearing event and card linkage
configurations:
GET /ISAPI/AccessControl/ClearEventCardLinkageCfg/capabilities?format=json .
18.Added the URIs to get the total number of access control events by
specific conditions:
Get capability: GET /ISAPI/AccessControl/AcsEventTotalNum/capabilities?format=json ;
Get the total number: POST /ISAPI/AccessControl/AcsEventTotalNum?format=json .
19.Extended message of access control event
information
( JSON_EventNotificationAlert_AccessControlEventEg ):
added 11
authentication modes "faceOrFpOrCardOrPw" (face or fingerprint or card or
password), "faceAndFp" (face+fingerprint), "faceAndPw" (face+password), "faceAndCard" (face
+card), "face" (face), "faceAndFpAndCard"
(face+fingerprint+card), "faceAndPwAndFp" (face
+password+fingerprint), "employeeNoAndFace" (employee No.+face), "faceOrfaceAndCard"
(face or face+card), "fpOrface"
(fingerprint or face), and "cardOrfaceOrPw" (card or face or
password) to the node currentVerifyMode (authentication modes).
20.Added the
function of configuring anti-passing back, refer to Configure Anti-Passing Back for
details.
21.Added
functions of configuring cross-controller anti-passing back, refer to Cross-Controller
Anti-Passing Back Configuration for details.
22.Added the URIs to configure alarm input and output, refer to Alarm Input and Output for
details.
23.Added the URIs to get access controller working status, customize Wiegand rule,
configure log
mode,
configure SMS function, and configure event optimization, refer to Configuration and
Maintenance for details.
24.Added the URIs to
configure door (floor), reader, access controller, and OSDP card reader, refer
to Device/Server Settings for details.
25.Added the URIs to
configure M1 card encryption authentication, refer to M1 Card Encryption
## Authentication
for details.
Intelligent Security API (Access Control on Person) Developer Guide
## 10

26.Added the URIs to configure multiple authentication, refer to Multi-Factor Authentication for
details.
27.Added the URIs to configure multi-door interlocking, refer to Multi-Door Interlocking for
details.
28.Extended access control capability message XML_Cap_AccessControl (related URI: /ISAPI/
AccessControl/capabilities
## ):
added 49 nodes from <isSupportRemoteControlDoor> to <isSupportLogModeCfg>.
29.Extended configuration capability message of security control panel JSON_HostConfigCap
(related URI: /ISAPI/SecurityCP/Configuration/capabilities?format=json ):
added six nodes isSptNetCfg (whether the device supports network configuration),
isSptReportCenterCfg (whether the device supports configuring method to uploading reports),
isSptAlarmInCfg (whether the device supports configuring alarm input parameters),
isSptAlarmOutCfg (whether the device supports configuring alarm output parameters),
isSptSetAlarmHostOut (whether the device supports
setting alarm output), and
isSptControlAlarmChan (whether the device supports arming or disarming the alarm input
port (zone)).
30.Added a sub status code 0x60001024-"eventNotSupport" (event
subscription is not supported)
to status code 6 (Invalid Message Content) in Error Codes in ResponseStatus .
Summary of Changes in Version 2.0_Aug., 2018
New document.
Intelligent Security API (Access Control on Person) Developer Guide
## 11

Chapter 2 ISAPI Description
The design of Intelligent Security API (hereafter referred as to ISAPI) adopts RESTful style, so this
part introduces the
predefined resource operation methods, API (URL) format, interaction message
format, time format, namespace, and error processing method.
## 2.1 Operation Method
The methods to operate resources via ISAPI are same as those of HTTP (Hyper Text Transport
Protocol) and RTSP (Real Time Streaming Protocol).
## Note
The RTSP operation methods are mainly used to get the real-time stream for live view, two-way
audio, and playback in this manual. For details about HTTP and RTSP, please refer to https://
tools.ietf.org/html/rfc2612 and https://tools.ietf.org/html/rfc2326 .
Table 2-1 HTTP Operation Method
MethodDescription
POSTCreate resources. This method is only available for adding resource that does
not exist before.
GETRetrieve resources. This method cannot change the system status, only return
data as the response to the requester.
PUTUpdate resources. This method is usually for update the resource that already
exists, but it can also be used to create the resource if the specific resource
does not exist.
DELETEDelete resources.
Table 2-2 RTSP Operation Method
MethodDescription
OPTIONSGet the supported RTSP operation methods. See the request and response
message format below when interacting between client software and server.
OPTIONS  %s RTSP/1.0\r\n  //Request URL
CSeq:%u\r\n               //Command No.
User-Agent:%s\r\n         //Client software name
## \r\n
/*Succeeded*/
RTSP/1.0 200 OK\r\n
CSeq: %u\r\n              //Command No.
Intelligent Security API (Access Control on Person) Developer Guide
## 12

MethodDescription
Public: %s\r\n            //Supported operation methods
Date:%s\r\n               //Date and time
## \r\n
/*Failed*/
RTSP/1.0 4XX/5XX %s\r\n
CSeq: %u\r\n              //Command No.
Date:%s\r\n               //Date and time
## \r\n
DESCRIBETransfer basic information by SDP (Session Description Protocol, see https://
tools.ietf.org/html/rfc2327 ) files, such as URL with SETUP command and so
on. See the request and response message format below when interacting
between client software and server.
DESCRIBE  %s RTSP/1.0\r\n     //URL
CSeq:%u\r\n                   //Command No.
Accept: application/sdp\r\n   //The SDP description is accepted
Authorization:%s\r\n          //Authentication information
User-Agent:%s\r\n             //Client software name
## \r\n
/*Succeeded*/
RTSP/1.0 200 OK\r\n
CSeq: %u\r\n                         //Command No.
Content-Type: application/sdp\r\n    //The SDP description exists behind the command
Content-Base:%s\r\n                  //URL
Content-Length: %d\r\n               //The length of contents behind the command
## \r\n
[content]                            //SDP description
/*Failed*/
RTSP/1.0 4XX/5XX %s\r\n
CSeq: %u\r\n                         //Command No.
## \r\n
## SETUP
Interact the session information, such as transmission mode, port number,
and so on. See the request and response message format below when
interacting between client software and server.
SETUP %s RTSP/1.0\r\n    //URL
CSeq:%u\r\n              //Command No.
Authorization:%s\r\n     //Authentication information
Session:%s\r\n           //Session ID is only returned at the even number of times
Transport: %s\r\n        //Transmission protocol
User-Agent:%s\r\nv       //Client software name
## \r\n
/*Succeeded*/
RTSP/1.0 200 OK \r\n
Intelligent Security API (Access Control on Person) Developer Guide
## 13

MethodDescription
CSeq: %u\r\n
Session:%s\r\n           //Session ID
Transport: s%            //Transmission method
Date: s%                 //Date and time
/*Failed*/
RTSP/1.0 4XX/5XX %s\r\n
CSeq: %u\r\n             //Command No.
## \r\n
PLAYStart the stream transmission. See the request and response message format
below when interacting between client software and server.
PLAY %s RTSP/1.0\r\n     //URL
CSeq:%u\r\n              //Command No.
Authorization:%s\r\n     //Authentication information
Session:%s\r\n           //Session ID
Range: npt=%f-%f\r\n     //Determine the play range
User-Agent:%s\r\n        //Client software name
## \r\n
/*Succeeded*/
RTSP/1.0 200 OK \r\n
CSeq: %u\r\n
## Session:%s\r\n
RTP-Info:%s
## Date:  %s
/*Failed*/
RTSP/1.0 4XX/5XX %s\r\n
CSeq: %u\r\n             //Command No.
## Session:%s\r\n
## \r\n
## PAUSE
Pause the stream transmission.
TEARDOWNStop the stream transmission. See the request and response message format
below when interacting between client software and server.
TEARDOWN %s RTSP/1.0\r\n  //URL
CSeq: %u\r\n              //Command No.
Authorization:%s\r\n      //Authentication information
Session:%s\r\n            //Session ID
User-Agent:%s\r\n         //Client software name
## \r\n
/*Succeeded*/
RTSP/1.0 200 OK \r\n
CSeq: %u\r\n
## Session:%s\r\n
Intelligent Security API (Access Control on Person) Developer Guide
## 14

MethodDescription
## Date:%s\r\n
## \r\n
/*Failed*/
RTSP/1.0 4XX/5XX %s\r\n
CSeq: %u\r\n             //Command No.
## Session:%s\r\n
## \r\n
2.2 URL Format
URL (Uniform Resource Locator) is a further class of URIs, it can
identify a resource and locate the
resource by describing its primary access mechanism.
The format of URL is defined as the follows: <protocol>://<host>[:port][abs_path [?query]].
protocol
Protocol types, i.e., HTTP (version 1.1) and RTSP (version 1.0).
host
Host name, IP address, or the FQDN (Fully
Qualified Domain Name) of network devices.
port
Port number of host service for listening the
connection status of TCP (Transmission Control
Protocol, see
https://tools.ietf.org/html/rfc793 ) or UDP (User Datagram Protocol, see https://
tools.ietf.org/html/rfc768 ). If this field is not configured, the default port number will be
adopted. For HTTP, the default port number is 80, and for RTSP, the default port number is 554.
abs_path
Resource URI: /ServiceName/ResourceType/resource. Here, the ServiceName is ISAPI; the
ResourceType is
predefined with upper camel case according to different functions , see details
in the following table; the resource is
defined with lower camel case and can be extended in
actual
applications. E.g., /ISAPI/System/Network/interfaces.
## Predefined
URI ModelDescription
/ISAPI/System/...System related resources
/ISAPI/Security/...Security related resources
/ISAPI/Event...Event/alarm related resources
/ISAPI/Image/...Video encoding and image related resources
/ISAPI/ContentMgmt/
## ...
Storage management related resources
query
Intelligent Security API (Access Control on Person) Developer Guide
## 15

Strings for describing resources information, including related parameters. The parameter
names and values must be listed as the following format in this field: ?p1=v1&p2=v2&...&pn=vn.
## Note
•To locate the connected device, when
operating lower-level device via the URL, the query
field should be filled as ?devIndex=uuid&p1=v1&p2=v2&...&pn=vn. The uuid (or guid) is a 32-
byte (128 bits) random number, which is unique and generated by operating system when
adding device, and its format is "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".
•For message in JSON format, the query
field should be filled as ?
format=json&p1=v1&p2=v2&...&pn=vn. For details about message format, refer to the next
section below. E.g.,http://10.17.132.22/ISAPI/System/time?
foramt=json&devIndex=550e8400e29b41d4a716446655440000.
## 2.3 Message Format
During the ISAPI integration, the request and response messages generated among the interaction
between devices and platform are data in XML format or JSON format.
## Note
The message format here is only available for URLs based on HTTP.
XML Format
•For the previous integration, XML is a common format which may only cause a little changes in
the later
integration.
•Generally, for configuration information, the Content-Type in the XML format message is
"application/xml; charset='UTF-8'", see details below.
//Request Message
GET /ISAPI/System/status HTTP/1.1
## ...
//Response Message
## HTTP/1.1 200 OK
## ...
Content-Type: application/xml; charset="UTF-8"
## ...
<?xml version="1.0" encoding="UTF-8"?>
<DeviceStatus version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
## ...
</DeviceStatus>
For data (e.g., firmware, configuration files), the Content-Type in the XML format message is
"application/octet-stream", see details below.
//Request Message
PUT /ISAPI/System/configurationData HTTP/1.1
Intelligent Security API (Access Control on Person) Developer Guide
## 16

## ...
Content-Type: application/octet-stream
## ...
[proprietary configuration file data content]
//Response Message
## HTTP/1.1 200 OK
## ...
Content-Type: application/xml; charset="UTF-8"
## ...
<?xml version="1.0" encoding="UTF-8"?>
<ResponseStatus version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
## ...
</ResponseStatus>
JSON Format Message
•The leaf node (without any sub node) in the message is named by lower camel case, while the
non-leaf node in the message in named by upper camel case.
•To communicate by the messages in JSON format, the devices must support the public
specifications in http://www.ecma-international.org/publications/files/ECMA-ST/
ECMA-404.pdf and HTTP with version 1.1.
## Note
JSON is a lightweight data format which is a subset of JavaScript language and is small, fast, and
easy to be parsed.
•Generally, for configuration information, the Content-Type of message is "application/json", see
the example below:
//Request message
GET /ISAPI/System/status HTTP/1.1
## ...
//Response message
## HTTP/1.1 200 OK
## ...
Content-Type: application/json
## ...
"DeviceStatus":""
## ...
For data (e.g., firmware, configuration files), the Content-Type of message is "application/octet-
stream",
see the example below:
//Request message
PUT /ISAPI/System/configurationData HTTP/1.1
## ...
Content-Type: application/octet-stream
## ...
[proprietary configuration file data content]
Intelligent Security API (Access Control on Person) Developer Guide
## 17

//Response message
## HTTP/1.1 200 OK
## ...
Content-Type: application/json
## ...
"ResponseStatus":""
## ...
## 2.4 Others
## Time Format
The time format during ISAPI integration adopts ISO8601 standard (see details in http://
www.w3.org/TR/NOTE-datetime-970915 ), that is, YYY-MM-DDThh:mm:ss.sTZD (e.g.,
## 2017-08-16T20:17:06+08:00).
## Namespace
For message in XML format, namespace is required. The following namespaces are available:
•xmlns=http://www.isapi.org/ver20/XMLSchema
•xmlns:xs="http://www.w3.org/2001/XMLSchema"
•xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
## •xmlns:xlink="http://www.w3.org/1999/xlink"
## Error Processing
During the integration applications of ISAPI protocol, when the error of URL based on HTTP
occurred, the ResponseStatus message (in XML or JSON format) which contains error code will be
returned. If the error of URL based on RTSP occurs, the corresponding status code will directly be
returned, for details, refer to
https://tools.ietf.org/html/rfc2326 .
Intelligent Security API (Access Control on Person) Developer Guide
## 18

## Chapter 3 Security
This part mainly introduces the authentication, user permission, and encryption in the integration
applications
of ISAPI.
## 3.1 Authentication
When communicating via ISAPI protocol, the digest of the session must be authenticated.
## Note
•The
authentication must based on HTTP Authentication: Basic and Digest Access Authentication,
see https://tools.ietf.org/html/rfc2617 for details.
•The request session must contain authentication information, otherwise, device will return 401
error code.
The message digest, which contains user name, password, specific nonce value, HTTP or RTSP
operation methods, and request URL, is generated by the MD5 algorithm, see the calculation rules
below.
qop=Undefined
Digest=MD5(MD5(A1):<nonce>:MD5(A2))
qop="auth:"
Digest=MD5(MD5(A1):<nonce>:<nc>:<cnonce>:<qop>:MD5(A2))
qop="auth-int:"
Digest=MD5(MD5(A1):<nonce>:<nc>:<cnonce>:<qop>:MD5(A2))
## Note
•The qop is a value for determining whether the
authentication is required.
•A1 and A2 are two data blocks required for digest calculation.
A1: Data block about security, which contains user name, password, security domain, random
number, and so on. If the digest calculation algorithm is MD5, A1=<user>:<realm>:<password>;
if the algorithm is MD5-sess, A1=MD5(<user>:<realm>:<password>):<nonce>:<cnonce>.
A2: Data block about message, such as URL, repeated requests, message body, and so on, it
helps to prevent repeated, and realize the resource/message tamper-proof. If the qop is not
defined or it is "auth:", A2=<request-method>:<uri-directive-value>; if the qop is "auth-int:",
A2=<request-method>:<uri-directive-value>:MD5(<request-entity-body>).
•The nonce is the random number generated by service, the following generation formula is
suggested: nonce = BASE64(time-stamp MD5(time-stamp ":" ETag ":" private-key)). The time-
stamp
in the formula is the time stamp generated by service or the unique serial No.; the ETag is
Intelligent Security API (Access Control on Person) Developer Guide
## 19

the value of HTTP ETag header in the request message; the priviate-key is the data that only
known by service.
If authentication failed, the device will return the XML_ResponseStatus_AuthenticationFailed
message, and the remaining authentication attempts will also be returned. If the remaining
attempts is 0, the user will be locked at the next authentication attempt.
Intelligent Security API (Access Control on Person) Developer Guide
## 20

## Chapter 4 Typical Applications
## 4.1 Manage Person Information
A person is a basic unit, which can link with multiple cards and fingerprints, for access control in
this manual. So, before starting any other operations, you should add persons and apply the
person information (e.g., person ID, name, organization, permissions, and so on) to access control
devices.
## Steps
Figure 4-1 Programming Flow of Managing Person Information
1.Call /ISAPI/AccessControl/UserInfo/capabilities?format=json by GET method to get the person
management capability to know the supported
functions.
The field supportFunction with different values (i.e., "post"-support adding person, "delete"-
support deleting person, "put"-support editing person information, "get"-support searching for
persons) is returned in the JSON_Cap_UserInfo message.
2.Call /ISAPI/AccessControl/UserInfo/Record?format=json by POST method to add a person.
Intelligent Security API (Access Control on Person) Developer Guide
## 21

The person information, assigned access permission, and configured authentication mode are
all added and applied to the access control device.
## 3.
Optional: Perform the following operation(s) by the corresponding URIs after adding persons.
## Set Person
## Information
PUT /ISAPI/AccessControl/UserInfo/SetUp?format=json
## Edit Person
## Information
PUT /ISAPI/AccessControl/UserInfo/Modify?format=json
Delete Person OnlyPUT /ISAPI/AccessControl/UserInfo/Delete?format=json
## Note
The timeout of deleting person only can be configured, and setting
the timeout to 60s is suggested.
Delete Person with
## Linked Cards,
Fingerprints, and
## Permissions
PUT /ISAPI/AccessControl/UserInfoDetail/Delete?format=json
## Note
•Before
deleting person with linked cards, fingerprints, and
permissions, you should call /ISAPI/AccessControl/
UserInfoDetail/Delete/capabilities?format=json by GET method
to get the deleting capability to know the supported deleting
modes (delete all or delete by person) and other configuration
details.
•You can call /ISAPI/AccessControl/UserInfoDetail/
DeleteProcess?format=json by GET method to get the
deleting
status.
•For linking cards and fingerprint to the person, refer to Manage
Card Information and Manage Fingerprint Information .
Search for PersonsPOST /ISAPI/AccessControl/UserInfo/Search?format=json
Get Number of Total
## Added Persons
GET /ISAPI/AccessControl/UserInfo/Count?format=json
## 4.2 Manage Card Information
If a person want to access by card, you should add cards and link the cards with the person for
getting the access permissions, and then apply card information (e.g., card No., card type, and so
on) to access control device.
## Before You Start
Make sure you have collected the card
information, refer to Collect Card Information for details.
Intelligent Security API (Access Control on Person) Developer Guide
## 22

## Steps
Figure 4-2 Programming Flow of Managing Card Information
1.Call /ISAPI/AccessControl/CardInfo/capabilities?format=json by GET method to get the card
management capability for knowing the supported
functions.
The field supportFunction with different values (i.e., "post"-support adding card, "delete"-
support
deleting card, "put"-support editing card information, "get"-support searching for
cards) is returned in the JSON_Cap_CardInfo message.
2.Call /ISAPI/AccessControl/CardInfo/Record?format=json by POST method to add a card.
The card
information (such as card No., card type, and so on) is added to the access control
device and linked to the person according to the employee No.
## 3.
Optional: Perform the following operation(s) by the corresponding URIs after adding cards.
## Set Card
InformationPUT /ISAPI/AccessControl/CardInfo/SetUp?format=json
Edit Card InformationPUT /ISAPI/AccessControl/CardInfo/Modify?format=json
Delete CardPUT /ISAPI/AccessControl/CardInfo/Delete?format=json
Intelligent Security API (Access Control on Person) Developer Guide
## 23

## Note
The timeout of deleting card can be configured, and setting the
timeout to 60s is suggested.
Search for CardsPOST /ISAPI/AccessControl/CardInfo/Search?format=json
Get Number of Total
## Added Cards
GET /ISAPI/AccessControl/CardInfo/Count?format=json
Get Number of Cards
Linked to A Specific
## Person
GET /ISAPI/AccessControl/CardInfo/Count?
format=json&employeeNo=<ID>
## 4.2.1 Collect Card Information
The card information for further management and applying should be collected by the card reading
module of the access control device
first. The following contents are about the process and
parameter settings of collecting card information.
## Steps
1.Call
/ISAPI/AccessControl/capabilities by GET method to get the functional capability of access
control and check whether the device supports
collecting card information.
The capability will be returned in the message XML_Cap_AccessControl .
If the device supports
collecting card information, the node <isSupportCaptureCardInfo> is
returned and its value is "true", and then you can perform the following steps. Otherwise, it
indicates that
collecting card information is not supported by the device, please end this task.
## 2.
Optional: Call /ISAPI/AccessControl/CaptureCardInfo/capabilities?format=json by GET method
to get the capability of collecting card information.
3.Call /ISAPI/AccessControl/CaptureCardInfo?format=json by GET method to collect the card
information.
## 4.3 Manage Fingerprint
## Information
If a person wants to access by fingerprint, you should collect the fingerprint data via the fingerprint
recorder first, and then apply the fingerprint data and information (e.g., fingerprint ID, type, and so
on) to the fingerprint module of access control device and link the fingerprints with the person for
getting the access permissions.
## Before You Start
Make sure you have collected the
fingerprint data, refer to Fingerprint Collection for details.
Intelligent Security API (Access Control on Person) Developer Guide
## 24

## Steps
Figure 4-3 Programming Flow of Managing Fingerprint Information
## Note
To collect the fingerprint, refer to Fingerprint Collection for details.
1.Call /ISAPI/AccessControl/FingerPrintCfg/capabilities?format=json by GET method to get the
fingerprint configuration capability for knowing the required configuration details.
2.Call /ISAPI/AccessControl/FingerPrintDownload?format=json by POST method to set the
fingerprint parameters (e.g., an employee No. to be linked, fingerprint modules to be applied,
and so on) and start applying the recorded fingerprint data.
## Note
The binary fingerprint data is collected and recorded by the fingerprint recorder.
3.Call /ISAPI/AccessControl/FingerPrintProgress?format=json by GET method to get the applying
status and make sure the applying is completed.
Intelligent Security API (Access Control on Person) Developer Guide
## 25

## Note
The fingerprint data is linked to a person according to the configured employee No. and applied
to the specified fingerprint modules only when the value of applying status (totalStatus) is 1.
4.Optional: Perform the following operation(s) after applying the recorded fingerprint data.
## Set Fingerprint
## Parameters
POST /ISAPI/AccessControl/FingerPrint/SetUp?format=json
## Edit Fingerprint
## Parameters
POST /ISAPI/AccessControl/FingerPrintModify?format=json
## Get Fingerprint
## Data
POST /ISAPI/AccessControl/FingerPrintUpload?format=json
Get Data of All
Fingerprints of A
## Person
POST /ISAPI/AccessControl/FingerPrintUploadAll?format=json
## Delete Fingerprint
## Data
PUT /ISAPI/AccessControl/FingerPrint/Delete?format=json
## Note
•Before
deleting fingerprint data, you should call /ISAPI/
AccessControl/FingerPrint/Delete/capabilities?format=json by
GET method to get the deleting capability for knowing the
supported deleting modes (delete by person or by fingerprint
module) and other configuration details.
•This URI is only used to start
deleting the fingerprint data. So, to
judge whether the deleting is completed, you must repeatedly
call /ISAPI/AccessControl/FingerPrint/DeleteProcess?format=json
by GET method to get the
fingerprint deleting status.
## 4.3.1 Fingerprint Collection
The fingerprint information for further management and applying should be collected by
fingerprint recorder first. The following contents are about the process and parameter settings of
fingerprint collection.
a.Call /ISAPI/AccessControl/CaptureFingerPrint/capabilities by GET method to get the fingerprint
collection
capability.
b.Call /ISAPI/AccessControl/CaptureFingerPrint by POST method to collect the fingerprint
information.
Intelligent Security API (Access Control on Person) Developer Guide
## 26

## 4.4 Manage Face Information
If a person wants to access by face, you should collect face data via the face capture module of the
access control device first, create face picture libraries, and then apply face records (including face
record ID, information about the person in the picture, and so on) to face picture libraries for
getting the access permission.
## 4.4.1 Create Face Picture Library
The face picture library refers to the library of face pictures, including captured picture library,
resident population library, blacklist library, etc. You can create, edit, delete, and search for the face
picture libraries.
## Steps
Figure 4-4 Programming Flow of Creating Face Picture Library
1.Optional: Call /ISAPI/Intelligent/FDLib/capabilities?format=json by GET method to get the face
picture library capability and check the supported
operations of face picture libraries.
The face picture library capability is returned in the message JSON_FPLibCap . If the value of the
node <supportFDFunction> is "post, delete, put, get", it indicates that creating, editing,
deleting,
and searching for face picture libraries are supported, and you can perform the
following steps to implement these functions.
2.Call /ISAPI/Intelligent/FDLib?format=json by POST method to create a face picture library.
Intelligent Security API (Access Control on Person) Developer Guide
## 27

## Note
There are three types of face picture library, including infrared face picture library, list library,
and static library. So if you want to specify a face picture library, you should provide the library
type and library ID together.
The ID of the created face picture library (FDID) is returned.
## 3.
Optional: Perform the following operation(s) after creating a face picture library.
Edit A Face Picture LibraryPUT /ISAPI/Intelligent/FDLib?
format=json&FDID=&faceLibType=
Delete A Face Picture LibraryDELETE /ISAPI/Intelligent/FDLib?
format=json&FDID=&faceLibType=
## Delete All Face Picture
## Libraries
DELETE /ISAPI/Intelligent/FDLib?format=json
Search for A Specific Face
## Picture Library
GET /ISAPI/Intelligent/FDLib?
format=json&FDID=&faceLibType=
Search for All Face Picture
## Libraries
GET /ISAPI/Intelligent/FDLib?format=json
## Note
In the URI, both the library ID (FDID) and the library type (faceLibType) are required to specify a
face picture library, e.g., /ISAPI/Intelligent/FDLib?
format=json&FDID=1223344455566788&faceLibType=blackFD.
## 4.4.2 Collect Face Data
The face data for further management and applying should be collected by the face capture
module of the access control device first. The following contents are about the process and
parameter
settings of face data collection.
## Steps
## 1.
Optional: Call /ISAPI/AccessControl/CaptureFaceData/capabilities by GET method to get the
capability of collecting face data.
2.Call /ISAPI/AccessControl/CaptureFaceData by POST method to start
collecting face data.
3.Call /ISAPI/AccessControl/CaptureFaceData/Progress by GET method to get the progress of
collecting face data.
Intelligent Security API (Access Control on Person) Developer Guide
## 28

4.4.3 Manage Face Records in Face Picture Library
After creating face picture library, you can import face pictures with different types (i.e., picture
URL and binary picture) to add the face records to the library. And you can also edit, delete, and
search for the face records in the library for management.
## Before You Start
•Make sure you have added face picture libraries and get the ID of each library. For
creating face
picture library, refer to Create Face Picture Library for details.
•Make sure you have collected the face picture data, refer to Collect Face Data for details.
## Steps
Figure 4-5 Programming Flow of Managing Face Records in Face Picture Library
1.Prepare picture URLs (picture storage location) or binary pictures in form format for being
imported to the library.
2.Call /ISAPI/Intelligent/FDLib/FaceDataRecord?format=json by POST method to apply the
picture URL or binary picture with person
information for adding a face record to the library
according to the face picture library ID (FDID).
The face record ID (FPID) is returned in the message JSON_AddFaceRecordResult .
## 3.
Optional: Perform the following operation(s) after adding face records to the face picture
library.
## Edit Face Record
PUT /ISAPI/Intelligent/FDLib/FDSearch?
format=json&FDID=&FPID=&faceLibType=
Set Face RecordPUT /ISAPI/Intelligent/FDLib/FDSetUp?format=json
Intelligent Security API (Access Control on Person) Developer Guide
## 29

## Delete Face
## Record(s)
PUT /ISAPI/Intelligent/FDLib/FDSearch/Delete?
format=json&FDID=&faceLibType=
## Note
Deleting a face record or deleting face records in a batch are both
supported.
Search for Face
## Records
POST /ISAPI/Intelligent/FDLib/FDSearch?format=json
## Note
Searching multiple face picture libraries at a time and fuzzy search
are both supported.
Get Number of Face
Records of a Face
## Picture Library
GET /ISAPI/Intelligent/FDLib/Count?
format=json&FDID=&faceLibType=
Get Number of Face
Records of All Face
## Picture Libraries
GET /ISAPI/Intelligent/FDLib/Count?format=json
## Note
In the request URI, both the library ID (FDID) and library type (faceLibType) are required to
specify a face picture library, e.g., /ISAPI/Intelligent/FDLib?
format=json&FDID=1223344455566788&faceLibType=blackFD.
## 4.4.4 Configure Facial Recognition Mode
When recognizing human faces via the access control device, both the normal mode and the deep
mode are available. For the normal mode, the human face is recognized via white light camera; for
the deep mode, the human face is recognized by the IR light camera, which is applicable to a more
complicated environment and can recognize a much wider people range than the normal mode.
Intelligent Security API (Access Control on Person) Developer Guide
## 30

## Steps
Figure 4-6 Programming Flow of Configuring Facial Recognition Mode
1.Call /ISAPI/AccessControl/capabilities by GET method to get the functional capability of access
control and check whether the device supports
configuring facial recognition mode.
## Note
The capability will be returned in the message XML_Cap_AccessControl .
If the device supports configuring facial recognition mode, the node
<isSupportFaceRecognizeMode> is returned and its value is "true", and then you can perform
the following steps. Otherwise, it indicates that
configuring facial recognition mode is not
supported by the device, please end this task.
2.Optional: Call /ISAPI/AccessControl/FaceRecognizeMode/capabilities?format=json by GET
method to get the configuration capability of facial recognition mode for knowing the
supported facial
recognition modes.
3.Optional: Call /ISAPI/AccessControl/FaceRecognizeMode?format=json by GET method to get
the current facial recognition mode.
4.Perform one of the following
operations to add face records to face picture libraries for setting
normal or deep facial recognition mode.
## -
Add face records to the default face picture library with "blackFD" type, refer to Manage
Face Records in Face Picture Library for details.
## -
Add visible face pictures to the default face picture library with "blackFD" type, and add
infrared face pictures to the default library with "infraredFD" type, refer to Manage Face
Records in Face Picture Library for details.
Intelligent Security API (Access Control on Person) Developer Guide
## 31

## Note
Generally, during the initialization of the access control device, two face picture libraries with
"blackID" type (the library ID is 1) and "infraredFD" type (the library ID is 2) will be created
automatically. But if the default libraries have not been created, you should create them by
yourself, refer to Create Face Picture Library for details.
5.Call /ISAPI/AccessControl/FaceRecognizeMode?format=json by PUT method to
configure facial
recognition mode.
## Result
The device will reboot automatically after configuring facial recognition mode, and permissions
linked with face pictures in the library will be cleared.
## 4.5
## Configure Access Permission Control Schedule
To regularly control the access permissions for managing the accessible time duration (by default,
it is 24 hours) of some important access control points, you can
configure the week or holiday
schedules.
Perform this task to
configure access permission control schedule via ISAPI protocol.
Intelligent Security API (Access Control on Person) Developer Guide
## 32

## Steps
Figure 4-7 Programming Flow of Configuring Access Permission Control Schedule
1.Perform one of the following operations to set week or holiday schedule for access permission
control.
## -
a.Call /ISAPI/AccessControl/UserRightWeekPlanCfg/capabilities?format=json by GET
method to get the
configuration capability of access permission control week schedule for
knowing the
configuration details and notices.
b.Call /ISAPI/AccessControl/UserRightWeekPlanCfg/<PlanNo>?format=json by PUT
method to set the week schedule.
## -
a.Call /ISAPI/AccessControl/UserRightHolidayPlanCfg/capabilities?format=json by GET
method to get the configuration capability of access permission control holiday schedule
for knowing the
configuration details and notices.
b.Call /ISAPI/AccessControl/UserRightHolidayPlanCfg/<PlanNo>?format=json by PUT
method to set the holiday schedule.
c.Call
/ISAPI/AccessControl/UserRightHolidayGroupCfg/capabilities?format=json by GET
method to get the holiday group
configuration capability of access permission control
schedule for knowing the
configuration details and notices.
d.Call /ISAPI/AccessControl/UserRightHolidayGroupCfg/<GroupNo>?format=json by PUT
method to add the
configured holiday schedule to a holiday group for management.
Intelligent Security API (Access Control on Person) Developer Guide
## 33

## 2.
Optional: Call /ISAPI/AccessControl/UserRightPlanTemplate/capabilities?format=json by GET
method to get the configuration capability of access permission control schedule template for
knowing the configuration details and notices.
3.Call /ISAPI/AccessControl/UserRightPlanTemplate/<TemplateNo>?format=json by PUT
method to set template for access permission control schedule and link the
configured template
to the schedule.
## Note
For the above configuration URIs, before setting the parameters, you'd better perform GET
operation to get the existing or configured parameters for reference.
1.Optional: Call /ISAPI/AccessControl/ClearPlansCfg/capabilities?format=json by GET method to
get the capability of clearing schedule
configurations for knowing the configuration details and
notices.
5.Optional: Call /ISAPI/AccessControl/ClearPlansCfg?format=json by PUT method to clear the
schedule configurations.
## 4.6
## Configure Authentication Mode Control Schedule
You can configure the week or holiday schedule to regularly control the authentication modes
(e.g., by card, by card+password, by
fingerprint, by fingerprint+card, and so on) in some specific
time periods.
Perform this task to
configure authentication mode control schedule via ISAPI protocol.
Intelligent Security API (Access Control on Person) Developer Guide
## 34

## Steps
Figure 4-8 Programming Flow of Configuring Authentication Mode Control Schedule
1.Perform one of the following operations to set week or holiday schedule for authentication
mode control.
## -
a.Call
/ISAPI/AccessControl/VerifyWeekPlanCfg/capabilities?format=json by GET method
to get the
configuration capability of authentication mode control week schedule for
knowing the
configuration details and notices.
b.Call /ISAPI/AccessControl/VerifyWeekPlanCfg/capabilities?format=json by PUT method
to set the week schedule.
## -
a.Call /ISAPI/AccessControl/VerifyHolidayPlanCfg/capabilities?format=json by GETmethod
to get the configuration capability of authentication mode control holiday schedule for
knowing the
configuration details and notices.
b.Call /ISAPI/AccessControl/VerifyHolidayPlanCfg/<PlanNo>?format=json by PUT method
to set the holiday schedule.
c.Call
/ISAPI/AccessControl/VerifyHolidayPlanCfg/capabilities?format=json by GET
method to get the holiday group
configuration capability of authentication mode control
schedule for knowing the
configuration details and notices.
d.Call /ISAPI/AccessControl/VerifyHolidayGroupCfg/<GroupNo>?format=json by PUT
method to add the
configured holiday schedule to a holiday group for management.
Intelligent Security API (Access Control on Person) Developer Guide
## 35

## 2.
Optional: Call /ISAPI/AccessControl/VerifyPlanTemplate/capabilities?format=json by GET
method to get the configuration capability of authentication mode control schedule template
for knowing the configuration details and notices.
3.Call /ISAPI/AccessControl/VerifyPlanTemplate/<TemplateNo>?format=json by PUT method to
set template for
authentication mode control schedule.
## 4.
Optional: Call /ISAPI/AccessControl/CardReaderPlan/capabilities?format=json by GET method
to get the configuration capability of authentication mode control schedule for knowing the
configuration details and notices.
5.Call /ISAPI/AccessControl/CardReaderPlan/<CardReaderNo>?format=json by PUT method to
link the
configured template to the configured authentication mode control schedule.
## Note
For the above configuration URIs, before setting the parameters, you'd better perform GET
operation to get the existing or configured parameters for reference.
1.Optional: Call /ISAPI/AccessControl/ClearPlansCfg/capabilities?format=json by GET method to
get the capability of clearing schedule configurations for knowing the configuration details and
notices.
7.Optional: Call /ISAPI/AccessControl/ClearPlansCfg?format=json by PUT method to clear the
schedule configurations.
## 4.7
## Configure Door Control Schedule
You can configure the week or holiday schedule to regularly control the door statuses, including
Remain Open (access without
authentication), Remain Closed (access is not allowed), and Normal
(access with authentication), in some specific time periods.
Perform this task to
configure door control schedule via ISAPI protocol.
Intelligent Security API (Access Control on Person) Developer Guide
## 36

## Steps
Figure 4-9 Programming Flow of Configuring Door Control Schedule
1.Perform one of the following operations to set week or holiday schedule for door control.
## -
a.Call
/ISAPI/AccessControl/DoorStatusWeekPlanCfg/capabilities?format=json by GET
method to get the
configuration capability of door control week schedule for knowing the
configuration details and notices.
b.Call /ISAPI/AccessControl/DoorStatusWeekPlanCfg/<PlanNo>?format=json by PUT
method to set the week schedule.
## -
a.Call
/ISAPI/AccessControl/DoorStatusHolidayPlanCfg/capabilities?format=json by GET
method to get the
configuration capability of door control holiday schedule for knowing
the configuration details and notices.
b.Call /ISAPI/AccessControl/DoorStatusHolidayPlanCfg/<PlanNo>?format=json by PUT
method to set the holiday schedule.
c.Call
/ISAPI/AccessControl/DoorStatusHolidayPlanCfg/capabilities?format=json by GET
method to get the holiday group configuration capability of door control schedule for
knowing the
configuration details and notices.
d.Call /ISAPI/AccessControl/DoorStatusHolidayGroupCfg/<GroupNo>?format=json by PUT
method to add the configured holiday schedule to a holiday group for management.
Intelligent Security API (Access Control on Person) Developer Guide
## 37

## 2.
Optional: Call /ISAPI/AccessControl/DoorStatusPlanTemplate/capabilities?format=json by GET
method to get the configuration capability of door control schedule template for knowing the
configuration details and notices.
3.Call /ISAPI/AccessControl/DoorStatusPlanTemplate/<TemplateNo>?format=json by PUT
method to set template for door control schedule.
## 4.
Optional: Call /ISAPI/AccessControl/DoorStatusPlan/capabilities?format=json by GET method
to get the configuration capability of door control schedule for knowing the configuration
details and notices.
5.Call /ISAPI/AccessControl/DoorStatusPlan/<DoorNo>?format=json by PUT method to link the
configured template to the configured door control schedule.
## Note
For the above configuration URIs, before setting the parameters, you'd better perform GET
operation to get the existing or configured parameters for reference.
1.Optional: Call /ISAPI/AccessControl/ClearPlansCfg/capabilities?format=json by GET method to
get the capability of clearing schedule configurations for knowing the configuration details and
notices.
7.Optional: Call /ISAPI/AccessControl/ClearPlansCfg?format=json by PUT method to clear the
schedule configurations.
4.8 Remotely Control Door, Elevator, and Buzzer
You can remotely control the status of doors or elevators, and buzzer (i.e., start or stop buzzing).
Perform this task to remotely control doors, elevators, and buzzers via ISAPI protocol.
Intelligent Security API (Access Control on Person) Developer Guide
## 38

## Steps
Figure 4-10 Programming Flow of Remotely Controlling Door, Elevator, and Buzzer
1.Optional: Perform one of the following operations to get the capabilities of remote control to
know the available
configurations.
## -
## Call
/ISAPI/AccessControl/RemoteControl/door/capabilities by GET method to get the
capability of remote door or elevator control.
## -
Call /ISAPI/AccessControl/RemoteControl/buzzer/capabilities?format=json by GET method
to get the capability of remote buzzer control.
2.Perform one of the following
operations to control the doors, elevators, or buzzers.
## -
Call /ISAPI/AccessControl/RemoteControl/door/<ID> by PUT method to control the doors or
elevators remotely.
## Note
For doors, you can control them in Remain Open, Remain Closed, or Normal status; for
elevators, you can control them in the status of Elevator is Allowed to be Called by Visitor or
Elevator is Allowed to be Called by Resident Only.
## -
Call /ISAPI/AccessControl/RemoteControl/buzzer/<ID>?format=json by PUT method to
control buzzers remotely to start or stop buzzing.
## 4.9
Configure Password for Remote Door Control
If you want to remotely control the door via the EZVIZ Cloud Service, the password should be
verified to improve the security. You should configure the password for the door before you can
remotely control the door via the EZVIZ Cloud Service.
Intelligent Security API (Access Control on Person) Developer Guide
## 39

## Steps
Figure 4-11 Programming Flow of Configuring Password for Remote Door Control
1.Optional: Call /ISAPI/AccessControl/remoteControlPWCheck/capabilities?format=json by GET
method to get the capability of verifying password for remote door control.
The capability is returned in the message JSON_Cap_RemoteControlPWCheck .
2.Call /ISAPI/AccessControl/remoteControlPWCheck/door/<ID>?format=json by PUT method to
verify the password for remote door control.
## 3.
Optional: Call /ISAPI/AccessControl/remoteControlPWCfg/capabilities?format=json by GET
method to get the capability of configuring password for remote door control.
The capability is returned in the message JSON_Cap_RemoteControlPWCfg .
4.Call /ISAPI/AccessControl/remoteControlPWCfg/door/<ID>?format=json by PUT method to
configure the password for remote door control.
## 4.10
Configure and Search for Access Control Events
The access control events include device events, alarm input events, door events, card reader
events, card swiping events, and so on. You can
configure the linkage types (i.e., event linkage, card
linkage, MAC linkage, and person linkage) and linkage actions (e.g., recording, alarm output,
buzzing, capture, etc.) of event card linkage via ISAPI protocol to execute the linked
actions when
the corresponding events occurred (e.g., door open or closed, card swiped, etc.). And then you can
receive the event
information from event sources and search for events via ISAPI protocol.
Perform this task to configure and search for the access control events via ISAPI protocol.
Intelligent Security API (Access Control on Person) Developer Guide
## 40

## Steps
Figure 4-12 Programming Flow of Configuring and Searching for Access Control Events
Intelligent Security API (Access Control on Person) Developer Guide
## 41

## 1.
Optional: Call /ISAPI/AccessControl/DeployInfo/capabilities by GET method to get the
capability of getting arming information.
## Note
The available arming types, including arming via client software, real-time arming, and arming
via ISAPI protocol, are returned in the capability. For arming via client software, only one
channel can be armed and supports uploading offline events; for real-time arming, up to 4
channels can be armed and it is mainly used to arm the access control device via other devices,
but uploading offline events is not supported.
2.Optional: Call /ISAPI/AccessControl/DeployInfo by GET method to get the arming information,
such as arming No., arming types, and so on, for checking whether the device is armed by other
platforms or systems.
## 3.
Optional: Call /ISAPI/AccessControl/EventCardNoList/capabilities?format=json by GET method
to get the capability of the list of event and card linkage ID for knowing the range of event ID
that can be configured.
4.Optional: Call /ISAPI/AccessControl/EventCardNoList?format=json by GET method to get the
list of configured event and card linkage ID.
5.Call
/ISAPI/AccessControl/EventCardLinkageCfg/capabilities?format=json by GET method to
get the
configuration capability of event card linkage for knowing the configuration details and
notices.
6.Call /ISAPI/AccessControl/EventCardLinkageCfg/<ID>?format=json by PUT method to set the
event card linkages.
## 7.
Optional: Call /ISAPI/AccessControl/ClearEventCardLinkageCfg/capabilities?format=json by
GET method to get the capability of clearing event card linkage configurations.
8.Optional: Call /ISAPI/AccessControl/ClearEventCardLinkageCfg?format=json by PUT method to
clear the event card linkage configurations.
9.Receive access control alarm/event from the event source in arming mode (see Receive Alarm/
Event in Arming Mode ) or listening mode (see Receive Alarm/Event in Listening Mode ) when
the specified alarm is triggered or event occurred.
## Note
The access control event information (eventType: "AccessControllerEvent") is returned in
JSON_EventNotificationAlert_Alarm/EventInfo , see the EventNotificationAlert Message
Example of Access Control Event in the message for details.
10.Optional: Call /ISAPI/AccessControl/AcsEvent/capabilities?format=json by GET method to get
the event search capability for knowing the supported event types and other
information.
11.Call /ISAPI/AccessControl/AcsEvent?format=json by POST method to search for access control
events.
## 12.
Optional: Call /ISAPI/AccessControl/AcsEventTotalNum/capabilities?format=json by GET
method to get the capability of
getting total number of access control events by specific
conditions.
Intelligent Security API (Access Control on Person) Developer Guide
## 42

## 13.
Optional: Call /ISAPI/AccessControl/AcsEventTotalNum?format=json by POST method to get
the total number of access control events by specific conditions.
4.11 Configure Anti-Passing Back
The anti-passing back is to set the only route for passing the access control points and only one
person could pass
after swiping card. You can configure this function to enhance the access
security of some important and specific places (e.g., laboratories, offices).
## Steps
Figure 4-13 Programming Flow of Configuring Anti-Passing Back
## Note
Before setting the following parameters, you'd better get the existing or configured parameters for
reference by each configuration URIs with GET method.
1.Optional: Call /ISAPI/AccessControl/AntiSneakCfg/capabilities?format=json by GET method to
get the
anti-passing back configuration capability of the access controller.
## The
anti-passing back configuration capability JSON_Cap_AntiSneakCfg is returned.
Intelligent Security API (Access Control on Person) Developer Guide
## 43

2.Call
/ISAPI/AccessControl/AntiSneakCfg?format=json by PUT method to set the anti-passing
back parameters of the access controller.
3.Optional: Call /ISAPI/AccessControl/CardReaderAntiSneakCfg/capabilities?format=json by
GET method to get the anti-passing back configuration capability of the card reader.
4.Call /ISAPI/AccessControl/CardReaderCfg/<ID>?format=json by PUT method to set the
anti-
passing
back parameters of the card reader.
5.Perform the following operation(s) after configuring the anti-passing back function.
## Clear Anti-
passing Back
## Parameters
PUT /ISAPI/AccessControl/ClearAntiSneakCfg?format=json
## Note
The capability of clearing anti-passing back parameters
( JSON_Cap_ClearAntiSneakCfg ) can be obtained by calling /ISAPI/
AccessControl/ClearAntiSneakCfg/capabilities?format=json by GET
method.
## Clear Anti-
passing Back
## Records
If the anti-passing back event occurred, it will be recorded in the access
controller, so if needed, you can call /ISAPI/AccessControl/
ClearAntiSneak?format=json by PUT method for clearing the records.
## Note
The capability of clearing anti-passing back records
( JSON_Cap_ClearAntiSneak ) can be obtained by calling /ISAPI/
AccessControl/ClearAntiSneak/capabilities?format=json by GET
method.
4.12 Cross-Controller Anti-Passing Back Configuration
You can set anti-passing for card readers in multiple access controllers. You should swipe the card
according to the configured card swiping route or entrance/exit. And only one person can pass the
access control point
after swiping the card.
## 4.12.1
Configure Route Anti-Passing Back Based on Network
The route anti-passing back depends on the card swiping route. You should set the first card reader
and the card readers
afterwards. The anti-passing back will be judged according to the entrance
and exit information stored in the card readers.
Intelligent Security API (Access Control on Person) Developer Guide
## 44

## Steps
Figure 4-14 Programming Flow of Configuring Route Anti-Passing Back Based on Network
## Note
Before setting the following parameters, you'd better get the existing or configured parameters for
reference by each configuration URIs with GET method.
1.Call /ISAPI/AccessControl/SubmarineBackMode by PUT method to set the anti-passing back
mode and rule.
## Note
•For route
anti-passing back based on network, the mode must be set to
"internetCommunicate" and the rule should be set to "line".
•To get the capability of setting anti-passing back mode and rule, you should call /ISAPI/
AccessControl/SubmarineBackMode/capabilities by GET method. And the capability is
returned in the message XML_Cap_SubmarineBackMode .
2.Call /ISAPI/AccessControl/ReaderAcrossHost by PUT method to enable anti-passing back of
card readers.
Intelligent Security API (Access Control on Person) Developer Guide
## 45

## Note
To get the capability of enabling anti-passing back of card readers, you should call /ISAPI/
AccessControl/ReaderAcrossHost/capabilities by GET method. And the capability is returned in
the message XML_Cap_ReaderAcrossHost .
3.Perform one of the following
operations to configure anti-passing back server or access
controllers.
## -
Configure anti-passing back server:
a.Call /ISAPI/AccessControl/SubmarineBack by PUT method to specify an access controller
as the server for cross-controller anti-passing back and set the server parameters.
## Note
To get the capability of specifying a server for cross-controller anti-passing back, you
should call /ISAPI/AccessControl/SubmarineBack/capabilities by GET method. And the
capability is returned in the message XML_Cap_SubmarineBack .
b.Call /ISAPI/AccessControl/SubmarineBackHostInfo/ConfigureNo/<ID> by PUT method to
set
anti-passing back parameters of access controllers.
## Note
To get the capability of adding access controllers to the anti-passing back route, you
should call /ISAPI/AccessControl/SubmarineBackHostInfo/capabilities by GET method.
And the capability is returned in the message XML_Cap_SubmarineBackHostInfo .
c.Call /ISAPI/AccessControl/StartReaderInfo by PUT method to specify a first card reader.
## Note
To get the capability of specifying a first card reader, you should call /ISAPI/
AccessControl/StartReaderInfo/capabilities by GET method. And the capability is
returned in the message XML_Cap_StartReaderInfo .
d.Call /ISAPI/AccessControl/SubmarineBackReader/ConfigureNo/<ID> by PUT method to
set anti-passing back parameters of the first card reader and other card readers.
## Note
To get the capability of setting anti-passing back parameters for card readers, you should
call /ISAPI/AccessControl/SubmarineBackReader/capabilities by GET method. And the
capability is returned in the message XML_Cap_SubmarineBackReader .
## -
Configure anti-passing back access controllers:
Call /ISAPI/AccessControl/ServerDevice by PUT method to
notify the anti-passing back
server information to access controllers.
Intelligent Security API (Access Control on Person) Developer Guide
## 46

## Note
To get the capability of notifying anti-passing back server information to access controllers,
you should call /ISAPI/AccessControl/ServerDevice/capabilities by GET method. And the
capability is returned in the message XML_Cap_ServerDevice .
4.Perform the following
operation(s) after configuring route anti-passing back based on network.
## Clear Cross-
## Controller
## Anti-
## Passing Back
## Parameters
PUT /ISAPI/AccessControl/ClearSubmarineBack
## Note
To get the capability of clearing the cross-controller anti-passing back
parameters, you should call /ISAPI/AccessControl/
ClearSubmarineBack/capabilities by GET method. And the capability is
returned in message XML_Cap_ClearSubmarineBack .
## Clear Card
## Swiping Records
in Server
If the card is swiped in the anti-passing back route, it will be recorded in
the server. You can call /ISAPI/AccessControl/ClearCardRecord by PUT
method to clear card swiping records in the server.
## Note
To get the capability of clearing card swiping records in the server, you
should call /ISAPI/AccessControl/ClearCardRecord/capabilities by GET
method. And the capability is returned in message
XML_Cap_ClearCardRecord .
4.12.2 Configure Entrance/Exit Anti-Passing Back Based on Network
You can set the entrance card reader and the exit card reader only for entering and exiting, without
setting the first card reader and the card readers afterwards. It will authenticate the anti-passing
back according to the entrance and exit information on the card reader.
Intelligent Security API (Access Control on Person) Developer Guide
## 47

## Steps
Figure 4-15 Programming Flow of Configuring Entrance/Exit Anti-Passing Back Based on Network
## Note
Before setting the following parameters, you'd better get the existing or configured parameters for
reference by each configuration URIs with GET method.
1.Call /ISAPI/AccessControl/SubmarineBackMode by PUT method to set anti-passing back mode
and rule.
## Note
•For entrance and exit
anti-passing back based on network, the mode must be set to
"internetCommunicate" and the rule should be set to "inOrOut".
•To get the capability of setting anti-passing back mode and rule, you should call /ISAPI/
AccessControl/SubmarineBackMode/capabilities by GET method. And the capability is
returned in the message XML_Cap_SubmarineBackMode .
2.Call /ISAPI/AccessControl/ReaderAcrossHost by PUT method to enable anti-passing back of
card readers.
Intelligent Security API (Access Control on Person) Developer Guide
## 48

## Note
To get the capability of enabling anti-passing back of card readers, you should call /ISAPI/
AccessControl/ReaderAcrossHost/capabilities by GET method. And the capability is returned in
the message XML_Cap_ReaderAcrossHost .
3.Perform one of the following
operations to configure anti-passing back server or access
controllers.
## -
Configure anti-passing back server:
a.Call /ISAPI/AccessControl/SubmarineBack by PUT method to specify an access controller
as the server for cross-controller anti-passing back and set the server parameters.
## Note
To get the capability of specifying a server for anti-passing back, you should call /ISAPI/
AccessControl/SubmarineBack/capabilities by GET method. And the capability is
returned in the message XML_Cap_SubmarineBack .
b.Call /ISAPI/AccessControl/SubmarineBackHostInfo/ConfigureNo/<ID> by PUT method to
set
anti-passing back parameters of access controllers.
## Note
To get the capability of adding access controllers to anti-passing back route, you should
call /ISAPI/AccessControl/SubmarineBackHostInfo/capabilities by GET method. And the
capability is returned in the message XML_Cap_SubmarineBackHostInfo .
## -
Configure anti-passing access controllers:
Call /ISAPI/AccessControl/ServerDevice by PUT method to notify the anti-passing back
server
information to access controllers.
## -
## Note
To get the capability of notifying anti-passing back server information to access controllers,
you should call /ISAPI/AccessControl/ServerDevice/capabilities by GET method. And the
capability is returned in the message XML_Cap_ServerDevice .
4.Perform the following operation(s) after configuring entrance/exit anti-passing back based on
network.
## Clear Cross-
## Controller Anti-
## Passing Back
## Parameters
PUT /ISAPI/AccessControl/ClearSubmarineBack
## Note
To get the capability of clearing the cross-controller anti-passing back
parameters, you should call /ISAPI/AccessControl/
ClearSubmarineBack/capabilities by GET method. And the capability is
returned in message XML_Cap_ClearSubmarineBack
Intelligent Security API (Access Control on Person) Developer Guide
## 49

## Clear Card
## Swiping Records
in Server
If the card is swiped in the anti-passing back route or entrance/exit, it
will be recorded by the server. So you can call /ISAPI/AccessControl/
ClearCardRecord by PUT method for clearing card swiping records in the
server.
## Note
To get the capability of clearing card swiping records in server, you
should call /ISAPI/AccessControl/ClearCardRecord/capabilities by GET
method. And the capability is returned in message
XML_Cap_ClearCardRecord
4.12.3 Configure Route Anti-Passing Back Based on Card
The route anti-passing back depends on the card swiping route. You should set the first card reader
and the card readers
afterwards. It will judge the anti-passing back according to the entrance and
exit records in the card.
Intelligent Security API (Access Control on Person) Developer Guide
## 50

## Steps
Figure 4-16 Programming Flow of Configuring Route Anti-Passing Back Based on Card
## Note
Before setting the following parameters, you'd better get the existing or configured parameters for
reference by each configuration URIs with GET method.
1.Call /ISAPI/AccessControl/SubmarineBackMode by PUT method to set the anti-passing back
mode and rule.
## Note
•For route
anti-passing back based on card, the mode must be set to "cardReadAndWrite" and
the rule should be set to "line".
•To get the capability of setting anti-passing back mode and rule, you should call /ISAPI/
AccessControl/SubmarineBackMode/capabilities by GET method. And the capability is
returned in the message XML_Cap_SubmarineBackMode .
2.Call /ISAPI/AccessControl/ReaderAcrossHost by PUT method to enable anti-passing back of
card readers.
Intelligent Security API (Access Control on Person) Developer Guide
## 51

## Note
To get the capability of enabling anti-passing back of card readers, you should call /ISAPI/
AccessControl/ReaderAcrossHost/capabilities by GET method. And the capability is returned in
the message XML_Cap_ReaderAcrossHost .
3.Call
/ISAPI/AccessControl/SubmarineBackHostInfo/ConfigureNo/<ID> by PUT method to add
access controllers for anti-passing back and set their parameters.
## Note
To get the capability of adding access controllers to anti-passing back route, you should call /
ISAPI/AccessControl/SubmarineBackHostInfo/capabilities by GET method. And the capability is
returned in the message XML_Cap_SubmarineBackHostInfo .
4.Call /ISAPI/AccessControl/StartReaderInfo by PUT method to specify a first card reader.
## Note
To get the capability of specifying a first card reader, you should call /ISAPI/AccessControl/
StartReaderInfo/capabilities by GET method. And the capability is returned in the message
XML_Cap_StartReaderInfo .
5.Call /ISAPI/AccessControl/SubmarineBackReader/ConfigureNo/<ID> by PUT method to set the
anti-passing back parameters of the first card reader and other card readers.
## Note
To get the capability of setting anti-passing back parameters for card readers, you should call /
ISAPI/AccessControl/SubmarineBackReader/capabilities by GET method. And the capability is
returned in the message XML_Cap_SubmarineBackReader .
6.Optional: Call /ISAPI/AccessControl/ClearSubmarineBack by PUT method to clear the cross-
controller
anti-passing back parameters.
## Note
To get the capability of clearing the cross-controller anti-passing back parameters, you should
call /ISAPI/AccessControl/ClearSubmarineBack/capabilities by GET method. And the capability
is returned in message XML_Cap_ClearSubmarineBack .
4.12.4 Configure Entrance/Exit Anti-Passing Back Based on Card
You can set the entrance card reader and the exit card reader only for entering and exiting without
setting the first card reader and card readers afterwards. The anti-passing back will be judged
according to the entrance and exit records in the card.
Intelligent Security API (Access Control on Person) Developer Guide
## 52

## Steps
Figure 4-17 Programming Flow of Configuring Entrance/Exit Anti-Passing Back Based on Card
## Note
Before setting the following parameters, you'd better get the existing or configured parameters for
reference by each configuration URIs with GET method.
1.Call /ISAPI/AccessControl/SubmarineBackMode by PUT method to set the anti-passing back
mode and rule.
## Note
•For entrance and exit
anti-passing back based on card, the mode must be set to
"cardReadAndWrite" and the rule should be set to "inOrOut".
•To get the capability of setting anti-passing back mode and rule, you should call /ISAPI/
AccessControl/SubmarineBackMode/capabilities by GET method. And the capability is
returned in the message XML_Cap_SubmarineBackMode .
2.Call /ISAPI/AccessControl/ReaderAcrossHost by PUT method to enable anti-passing back of
card readers.
## Note
To get the capability of enabling anti-passing back of card readers, you should call /ISAPI/
AccessControl/ReaderAcrossHost/capabilities by GET method. And the capability is returned in
the message XML_Cap_ReaderAcrossHost .
3.Call /ISAPI/AccessControl/SubmarineBackHostInfo/ConfigureNo/<ID> by PUT method to add
access controllers for entrance and exit
anti-passing back and set the parameters.
Intelligent Security API (Access Control on Person) Developer Guide
## 53

## Note
To get the capability of adding access controllers for entrance and exit anti-passing back, you
should call /ISAPI/AccessControl/SubmarineBackHostInfo/capabilities by GET method. And the
capability is returned in the message XML_Cap_SubmarineBackHostInfo .
## 4.
Optional: Call /ISAPI/AccessControl/ClearEventCardLinkageCfg?format=json by PUT method to
clear the cross-controller anti-passing back parameters.
## Note
To get the capability of clearing cross-controller anti-passing back parameters, you should call /
ISAPI/AccessControl/ClearSubmarineBack/capabilities by GET method. And the capability is
returned in message XML_Cap_ClearSubmarineBack .
4.13 Alarm/Event Receiving
When the alarm is triggered or the event occurred, if you have configured alarm/event uploading
parameters, you can receive and process the alarm/event
information in the third-party platform
or system. Two modes are available for receiving alarms, including arming mode and listening
mode.
## Arming Mode
When the alarm is triggered or event occurred, the third-party
platform or system can send the
request URL to the device for getting the alarm/event stream, and then the device uploads the
response message with alarm/event information.
## Listening Mode
When alarm is triggered or event occurred, the device uploads the alarm
information
automatically, and then the third-party platform or system can receives the alarm/event by
configuring listening port of HTTP host server.
## Note
Currently, for traffic camera or capture camera, receiving alarm or event in arming mode is not
supported.
4.13.1 Receive Alarm/Event in Arming Mode
When alarm is triggered or event occurred, and the alarm/event linkage is configured, you can
send request message to device for
getting the alarm/event stream, and then the device uploads
the corresponding response message, which contains alarm/event
information.
Intelligent Security API (Access Control on Person) Developer Guide
## 54

## Before You Start
Make sure you have configured alarm/event and triggered the alarm/event. For configuring alarm/
event parameters, refer to the some typical applications of alarm/event configuration.
## Steps
Figure 4-18 Programming Flow of Receiving Alarm/Event in Arming Mode
1.Call /ISAPI/Event/notification/alertStream by GET to get the alarm/event stream.
2.Check if the heartbeat receiving
timed out or network disconnected.
## -
If the heartbeat keeps alive and the network still connected, perform the following step to
continue.
## -
If the heartbeat receiving timed out or network disconnected, perform the above step
repeatedly until reconnected.
3.Receive and process the alarm/event information.
## Example
Sample Code of Receiving Alarm/Event in Arming Mode (without Binary Picture Data)
GET /ISAPI/Event/notification/alertStream HTTP/1.1
Host: data_gateway_ip
Connection: Keep-Alive
HTTP/1.1 401 Unauthorized
Date: Sun, 01 Apr 2018 18:58:53 GMT
## Server:
Content-Length: 178
Content-Type: text/html
Connection: keep-alive
Keep-Alive: timeout=10, max=99
WWW-Authenticate: Digest qop="auth",
realm="IP Camera(C2183)",
nonce="4e5468694e7a42694e7a4d364f4449354d7a6b354d54513d",
Intelligent Security API (Access Control on Person) Developer Guide
## 55

stale="FALSE"
GET /ISAPI/Event/notification/alertStream HTTP/1.1
Authorization: Digest username="admin",
realm="IP Camera(C2183)",
nonce="4e5468694e7a42694e7a4d364f4449354d7a6b354d54513d",
uri="/ISAPI/Event/notification/alertStream",
cnonce="3d183a245b8729121ae4ca3d41b90f18",
nc=00000001,
qop="auth",
response="f2e0728991bb031f83df557a8f185178"
## Host: 10.6.165.192
## HTTP/1.1 200 OK
MIME-Version: 1.0
Connection: close
Content-Type: multipart/mixed; boundary=<frontier>
## --<frontier>
Content-Type: application/xml; charset="UTF-8"
Content-Length: text_length
<EventNotificationAlert/>
## --<frontier>
## Note
Some alarm data is in JSON format, so the Content-Type may be "application/xml" or "application/
json".
4.13.2 Receive Alarm/Event in Listening Mode
When alarm is triggered or event occurred, and the alarm/event linkage is configured, the device
uploads the alarm/event
information automatically, you can receive the alarm/event by
configuring the listening port of HTTP host server.
## Before You Start
Make sure you have
configured alarm/event and triggered the alarm/event. For configuring alarm/
event parameters, refer to the some typical
applications of alarm/event configuration.
Intelligent Security API (Access Control on Person) Developer Guide
## 56

## Steps
Figure 4-19 Programming Manual of Receiving Alarm/Event in Listening Mode
1.Optional: Call /ISAPI/Event/notification/httpHosts/capabilities by GET method to get the
capability of HTTP listening server.
2.Call
/ISAPI/Event/notification/httpHosts by PUT method to set the parameters (including
listening address and listening port) of HTTP listening server.
## Note
Before setting the listening server, you'd better perform GET operation on the above URL to get
default or configured parameters for reference.
3.Call /ISAPI/Event/notification/httpHosts/<ID>/test by POST method to check if the listening
server is working normally.
4.Call
http://ipAddress:portNo/url by POST method to receive the alarm/event information from
the listening server.
## Example
Sample Code of Receiving Alarm/Event in Listening Mode
## •with Binary Picture Data
//Request
POST requestUrl HTTP/1.1
Host: data_gateway_ip:port
Accept-Language: en-US
Date: YourDate
Content-Type: multipart/form-data;boundary=<frontier>
Content-Length: body_length
Connection: keep-alive
## --<frontier>
Intelligent Security API (Access Control on Person) Developer Guide
## 57

Content-Disposition: form-data; name="Event_Type"
Content-Type: text/xml
Content-Length: xml_length
<EventNotificationAlert/>
## --<frontier>
Content-Disposition: form-data; name="Picture_Name"
Content-Length: image_length
Content-Type: image/pjpeg
[binary picture data]
## --<frontier>--
//Response
HTTP/1.1 HTTP statusCode
Date: YourDate
Connection: close
## •without Binary Picture Data
//Request
POST requestUrl HTTP/1.1
Host: data_gateway_ip:port
Accept-Language: en-US
Date: YourDate
Content-Type: text/xml;
Content-Length: text_length
## Connection: Close
<EventNotificationAlert/>
//Response
HTTP/1.1 HTTP statusCode
Date: YourDate
Connection: close
## Note
•The Host is the HTTP server domain name or IP address and port No.
•Some alarm data is in JSON format, so the Content-Type may be "text/xml" or "text/json".
## 4.14 Configure Attendance Status
The time and attendance refers to tracking and monitoring when employees start and stop
working, and working hours (including late arrivals, early departures,
time taken on breaks and
absenteeism, etc.). You can set the manual or
automatic time and attendance mode, or disable the
attendance mode. You can also set check in, check out, break out, break in, overtime in, or
overtime out to manually change the attendance status as needed.
## Before You Start
Make sure you have added at least one person, refer to Manage Person
Information for details.
Intelligent Security API (Access Control on Person) Developer Guide
## 58

## Steps
Figure 4-20 Programming Flow of Configuring Attendance Status
1.Optional: Call /ISAPI/AccessControl/attendanceStatusModeCfg/capabilities?format=json by
GET method to get the
configuration capability of the attendance mode for knowing the
supported
attendance modes.
## The
configuration capability of the attendance mode is returned in the message
JSON_Cap_AttendanceStatusModeCfg .
## 2.
Optional: Call /ISAPI/AccessControl/attendanceStatusModeCfg?format=json by GET method
to get the default or configured attendance mode for reference.
3.Call
/ISAPI/AccessControl/attendanceStatusModeCfg?format=json by PUT method to set the
attendance mode.
## 4.
Optional: Call /ISAPI/AccessControl/attendanceStatusRuleCfg/capabilities?format=json by
GET method to get the
configuration capability of attendance status and rule for knowing the
supported
attendance status and rules.
The configuration capability of the attendance status and rule is returned in the message
JSON_Cap_AttendanceStatusRuleCfg .
Intelligent Security API (Access Control on Person) Developer Guide
## 59

## 5.
Optional: Call /ISAPI/AccessControl/attendanceStatusRuleCfg?
attendanceStatus=&format=json by GET method to get the default or configured attendance
status and rule for reference.
6.Call /ISAPI/AccessControl/attendanceStatusRuleCfg?attendanceStatus=&format=json by PUT
method to set the
attendance status and rule.
## 4.15 Other Applications
4.15.1 Device/Server Settings
Door/Floor
FunctionDescription
Get door (floor) configuration
capability
GET /ISAPI/AccessControl/Door/param/<ID>/capabilities
Get or set door (floor)
parameters
GET or PUT /ISAPI/AccessControl/Door/param/<ID>
## Reader
FunctionDescription
Get reader configuration
capability
GET /ISAPI/AccessControl/CardReaderCfg/capabilities?
format=json
Get or set reader parametersGET or PUT /ISAPI/AccessControl/CardReaderCfg/<ID>?
format=json
NFC (Near-Field
## Communication) Function
Get configuration capability of enabling or disabling NFC
function
Request URI: GET /ISAPI/AccessControl/Configuration/NFCCfg/
capabilities?format=json
Get parameters of enabling or disabling NFC function
Request URI: GET /ISAPI/AccessControl/Configuration/NFCCfg?
format=json
Set parameters of enabling or disabling NFC function
Request URI: PUT /ISAPI/AccessControl/Configuration/NFCCfg?
format=json
RF (Radio Frequency) Card
## Recognition
Get configuration capability of enabling or disabling RF card
recognition
Intelligent Security API (Access Control on Person) Developer Guide
## 60

FunctionDescription
Request URI: GET /ISAPI/AccessControl/Configuration/
RFCardCfg/capabilities?format=json
Get parameters of enabling or disabling RF card recognition
Request URI: GET /ISAPI/AccessControl/Configuration/
RFCardCfg?format=json
Set parameters of enabling or disabling RF card recognition
Request URI: PUT /ISAPI/AccessControl/Configuration/
RFCardCfg?format=json
## Access Controller
FunctionDescription
Get configuration capability of
access controller
GET /ISAPI/AccessControl/AcsCfg/capabilities?format=json
Get or set access controller
parameters
GET or PUT /ISAPI/AccessControl/AcsCfg?format=json
OSDP (Open Supervised Device Protocol) Card Reader
FunctionDescription
Get capability of getting OSDP
card reader status
GET /ISAPI/AccessControl/OSDPStatus/capabilities?
format=json
Get OSDP card reader statusGET /ISAPI/AccessControl/OSDPStatus/<ID>?format=json
Get capability of setting OSDP
card reader ID
GET /ISAPI/AccessControl/OSDPModify/capabilities?
format=json
Set OSDP card reader IDPUT /ISAPI/AccessControl/OSDPModify/<ID>?format=json
## Intelligent Identity Recognition Terminal
FunctionDescription
Get configuration capability of
intelligent identity recognition
terminal
GET /ISAPI/AccessControl/IdentityTerminal/capabilities
Get parameters of intelligent
identity recognition terminal
GET /ISAPI/AccessControl/IdentityTerminal
Set parameters of intelligent
identity recognition terminal
PUT /ISAPI/AccessControl/IdentityTerminal
Intelligent Security API (Access Control on Person) Developer Guide
## 61

## Note
After configuring the identity recognition parameters, when the ID card is swiped to recognize, the
corresponding event information (eventType is "IDCardInfoEvent") will be uploaded in the
message JSON_EventNotificationAlert_UploadIDCardSwipingEvent .
## Picture Storage Server
FunctionDescription
Get picture storage server
capability
GET /ISAPI/System/PictureServer/capabilities?format=json
Get picture storage server
parameters
GET /ISAPI/System/PictureServer?format=json
Set picture storage server
parameters
PUT /ISAPI/System/PictureServer?format=json
4.15.2 Multi-Factor Authentication
Multi-factor authentication is to manage the cards by group and set the authentication for multiple
cards of one access control point (door).
## Mode Settings
FunctionDescription
Get configuration capability of
multi-​factor authentication
mode
GET /ISAPI/AccessControl/MultiCardCfg/capabilities?
format=json
Get or set parameters of multi-
factor authentication mode
GET or PUT /ISAPI/AccessControl/MultiCardCfg/<ID>?
format=json
## Group Settings
FunctionDescription
Get group configuration
capability
GET /ISAPI/AccessControl/GroupCfg/capabilities?format=json
Get or set group parametersGET or PUT /ISAPI/AccessControl/GroupCfg/<ID>?format=json
Get capability of clearing group
parameters
GET /ISAPI/AccessControl/ClearGroupCfg/capabilities?
format=json
Clear group parametersPUT /ISAPI/AccessControl/ClearGroupCfg?format=json
Intelligent Security API (Access Control on Person) Developer Guide
## 62

4.15.3 Multi-Door Interlocking
Multi-door interlocking is used to control the entry of persons to a secure area such as a clean
room, where dust or small
particles may be a problem. One rule is composed of at least two doors
and only one door can be opened simultaneously.
FunctionDescription
Get configuration capability of
multi-​door interlocking
GET /ISAPI/AccessControl/MultiDoorInterLockCfg/capabilities?
format=json
Get or set multi-​door
interlocking parameters
GET or PUT /ISAPI/AccessControl/MultiDoorInterLockCfg?
format=json
## 4.15.4 M1 Card Encryption Authentication
M1 card encryption can improve the security level of authentication.
FunctionDescription
Get configuration capability of
M1 card encryption
authentication
GET /ISAPI/AccessControl/M1CardEncryptCfg/capabilities
Get or set parameters of M1
card encryption authentication
GET or PUT /ISAPI/AccessControl/M1CardEncryptCfg
4.15.5 Alarm Input and Output
## Alarm Input
FunctionDescription
Get configuration capability of
alarm input
GET /ISAPI/SecurityCP/AlarmInCfg/capabilities?format=json
Get or set alarm input
parameters
GET or PUT /ISAPI/SecurityCP/AlarmInCfg/<ID>?format=json
Get capability of arming or
disarming alarm input (zone)
GET /ISAPI/SecurityCP/ControlAlarmChan/capabilities?
format=json
Arm or disarm alarm input
## (zone)
PUT /ISAPI/SecurityCP/ControlAlarmChan?format=json
Intelligent Security API (Access Control on Person) Developer Guide
## 63

## Alarm Output
FunctionDescription
Get configuration capability of
alarm output
GET /ISAPI/SecurityCP/AlarmOutCfg/capabilities?format=json
Get or set parameters of
multiple alarm outputs in a
batch
GET or PUT /ISAPI/SecurityCP/AlarmOutCfg?format=json
Get or set parameters of a
specific alarm output
GET or PUT /ISAPI/SecurityCP/AlarmOutCfg/<ID>?format=json
Get capability of setting alarm
output No. and status
GET /ISAPI/SecurityCP/SetAlarmHostOut/capabilities?
format=json
Set alarm output No. and
status
PUT /ISAPI/SecurityCP/SetAlarmHostOut?format=json
4.15.6 Configuration and Maintenance
Data Exporting and Importing
FunctionDescription
Export or import person
permission data securely
GET or POST /ISAPI/AccessControl/userData?secretkey=
## Note
To check whether the device supports exporting or importing
person permission data securely, you can call /ISAPI/
AccessControl/capabilities by GET method to get the functional
capability of access control. The capability is returned in the
message XML_Cap_AccessControl .
If the device supports exporting person permission data
securely, the node <isSupportUserDataExport> will be returned
in the message and its value is "true"; if the device supports
importing person permission data securely, the node
<isSupportUserDataImport> will be returned in the message
and its value is "true".
Export maintenance dataGET /ISAPI/AccessControl/maintenanceData?secretkey=
Intelligent Security API (Access Control on Person) Developer Guide
## 64

FunctionDescription
## Note
To check whether the device supports exporting the
maintenance data, you can call /ISAPI/AccessControl/
capabilities by GET method to get the functional capability of
access control. The capability is returned in the message
XML_Cap_AccessControl .
If the device supports
exporting the maintenance data, the
node <isSupportMaintenanceDataExport> will be returned in
the message and its value is "true".
## Access Control Status
FunctionDescription
Get capability of getting
working status of access
controller
GET /ISAPI/AccessControl/AcsWorkStatus/capabilities?
format=json
Get working status of access
controller
GET /ISAPI/AccessControl/AcsWorkStatus?format=json
Get capability of getting status
of secure door control unit
GET /ISAPI/AccessControl/DoorSecurityModule/moduleStatus/
capabilities
Get status of secure door
control unit
GET /ISAPI/AccessControl/DoorSecurityModule/moduleStatus
## Wiegand Settings
FunctionDescription
Get Wiegand configuration
capability
GET /ISAPI/AccessControl/WiegandCfg/capabilities
Get or set Wiegand parametersGET or PUT /ISAPI/AccessControl/WiegandCfg/wiegandNo/
## <ID>
Get configuration capability of
Wiegand rule
GET /ISAPI/AccessControl/WiegandRuleCfg/capabilities
Get or set Wiegand ruleGET or PUT /ISAPI/AccessControl/WiegandRuleCfg
Intelligent Security API (Access Control on Person) Developer Guide
## 65

## Log Mode
FunctionDescription
Get configuration capability of
log mode
GET /ISAPI/AccessControl/LogModeCfg/capabilities?
format=json
Get or set log modeGET or PUT /ISAPI/AccessControl/LogModeCfg?format=json
SMS ( Short Message Service)
FunctionDescription
Get SMS configuration
capability
GET /ISAPI/AccessControl/SmsRelativeParam/capabilities?
format=json
Get or set SMS parametersGET or PUT /ISAPI/AccessControl/SmsRelativeParam?
format=json
Get capability of linking door
permission to phone number
GET /ISAPI/AccessControl/PhoneDoorRightCfg/capabilities?
format=json
Get or set parameters of linking
door permission to phone
number
GET or PUT /ISAPI/AccessControl/PhoneDoorRightCfg/<ID>?
format=json
## Event Optimization
FunctionDescription
Get configuration capability of
event optimization
GET /ISAPI/AccessControl/EventOptimizationCfg/capabilities?
format=json
Get or set event optimization
parameters
GET or PUT /ISAPI/AccessControl/EventOptimizationCfg?
format=json
Text of Audio Prompt for Authentication Results
FunctionDescription
Get text configuration
capability of audio prompt for
authentication results
GET /ISAPI/AccessControl/Verification/ttsText/capabilities?
format=json
Get or set text parameters of
audio prompt for
authentication results
GET or PUT /ISAPI/AccessControl/Verification/ttsText?
format=json
Intelligent Security API (Access Control on Person) Developer Guide
## 66

## Face Picture Comparison Condition
FunctionDescription
Get condition configuration
capability of face picture
comparison
GET /ISAPI/AccessControl/FaceCompareCond/capabilities
Get or set condition
parameters of face picture
comparison
GET or PUT /ISAPI/AccessControl/FaceCompareCond
ID Card Blacklist
FunctionDescription
Get capability of applying ID
card blacklist
GET /ISAPI/AccessControl/IDBlackListCfg/capabilities
Apply ID card blacklistPUT /ISAPI/AccessControl/IDBlackListCfg
## Capture Triggering Settings
FunctionDescription
Get capability of getting
capture triggering parameters
GET /ISAPI/AccessControl/SnapConfig/capabilities
Get capture triggering
parameters
GET /ISAPI/AccessControl/SnapConfig
## Door Lock Status
FunctionDescription
Get configuration capability of
door lock status when the
device is powered off
GET /ISAPI/AccessControl/Configuration/lockType/
capabilities?format=json
Get or set door lock status
when the device is powered off
GET or PUT /ISAPI/AccessControl/Configuration/lockType?
format=json
Intelligent Security API (Access Control on Person) Developer Guide
## 67

Chapter 5 Request URL
The intelligent security API in request URL format for realizing the functions in this manual are
listed here for reference. You can search for the URLs and view their
definitions.
## 5.1 General Capabilities
5.1.1 /ISAPI/AccessControl/capabilities
Get the functional capability of access control.
Request URI Definition
Table 5-1 GET /ISAPI/AccessControl/capabilities
MethodGET
DescriptionGet the functional capability of access control.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_AccessControl
Failed: XML_ResponseStatus
## 5.2 Resource Management
5.2.1 /ISAPI/AccessControl/CaptureCardInfo/capabilities?format=json
Get the capability of collecting card information.
Request URI Definition
Table 5-2 GET /ISAPI/AccessControl/CaptureCardInfo/capabilities?format=json
MethodGET
DescriptionGet the capability of collecting card information.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 68

RequestNone.
ResponseSucceeded: JSON_CardInfoCap
Failed: JSON_ResponseStatus
5.2.2 /ISAPI/AccessControl/CaptureCardInfo?format=json
Collect card information.
Request URI Definition
Table 5-3 GET /ISAPI/AccessControl/CaptureCardInfo?format=json
MethodGET
DescriptionCollect card information by the card reading module of the device.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_CardInfo_Collection
Failed: JSON_ResponseStatus
5.2.3 /ISAPI/AccessControl/CaptureFaceData
Collect face picture information.
Request URI Definition
Table 5-4 POST /ISAPI/AccessControl/CaptureFaceData
MethodPOST
DescriptionCollect face picture information.
QueryNone.
RequestXML_CaptureFaceDataCond
ResponseSucceeded: XML_CaptureFaceData
Failed: XML_ResponseStatus
## Remarks
This API is allowed to return collected face pictures directly, and the blocking time cannot be too
long.
## Example
Interaction When No Face Data is Collected
Intelligent Security API (Access Control on Person) Developer Guide
## 69

POST /ISAPI/AccessControl/CaptureFaceData
Accept: text/html, application/xhtml+xml,
Accept-Language: zh-CN
Content-Type: application/xml
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)
Accept-Encoding: gzip, deflate
## Host: 10.10.36.29:8080
Content-Length: 9907
Connection: Keep-Alive
Cache-Control: no-cache
<CaptureFaceDataCond version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<captureInfrared>true<captureInfrared>
<dataType><!--input "binary" or "url" here--><dataType>
</CaptureFaceDataCond>
---------------------------------------------------------------------------------------------------
## HTTP/1.1 200 OK
MIME-Version: 1.0
Connection: close
Content-Type: application/xml; charset="UTF-8"
Content-Length: text_length
<CaptureFaceData version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<captureProgress>0</captureProgress>
</CaptureFaceData>
## Example
Interaction by URI
POST /ISAPI/AccessControl/CaptureFaceData
Accept: text/html, application/xhtml+xml,
Accept-Language: zh-CN
Content-Type: application/xml
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)
Accept-Encoding: gzip, deflate
## Host: 10.10.36.29:8080
Content-Length: 9907
Connection: Keep-Alive
Cache-Control: no-cache
<CaptureFaceDataCond version="2.0"
xmlns="http://www.isapi.org/ver20/XMLSchema">
<captureInfrared>true<captureInfrared>
</CaptureFaceDataCond>
---------------------------------------------------------------------------------------------------
## HTTP/1.1 200 OK
MIME-Version: 1.0
Connection: close
Content-Type: application/xml; charset="UTF-8"
Intelligent Security API (Access Control on Person) Developer Guide
## 70

Content-Length: text_length
<CaptureFaceData version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<faceDataUrl>url_string</faceDataUrl>
<captureProgress>100</captureProgress>
<infraredFaceDataUrl>url_string</infraredFaceDataUrl>
</CaptureFaceData>
## Example
Interaction with Binary Data
POST /ISAPI/AccessControl/CaptureFaceData
Accept: text/html, application/xhtml+xml,
Accept-Language: zh-CN
Content-Type: application/xml
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)
Accept-Encoding: gzip, deflate
## Host: 10.10.36.29:8080
Content-Length: 9907
Connection: Keep-Alive
Cache-Control: no-cache
<CaptureFaceDataCond version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<captureInfrared>true<captureInfrared>
<dataType>binary<dataType>
</CaptureFaceDataCond>
---------------------------------------------------------------------------------------------------
## HTTP/1.1 200 OK
MIME-Version: 1.0
Connection: close
Content-Type: multipart/form-data; boundary=<frontier>
Content-Length: all_length
## --<frontier>
Content-Type: application/xml; charset="UTF-8"
Content-Length: text_length
<CaptureFaceData/>
## --<frontier>
Content-Disposition: form-data; name="FaceData"; filename="FaceData.jpg"
Content-Type: image/jpeg
Content-Length: image_length
[picture data]
## --<frontier>
Content-Disposition: form-data; name="InfraredFaceData"; filename="InfraredFaceData.jpg"
Content-Type: image/jpeg
Content-Length: image_length
Intelligent Security API (Access Control on Person) Developer Guide
## 71

[picture data]
## --<frontier>--
5.2.4 /ISAPI/AccessControl/CaptureFaceData/capabilities
Get the capability of collecting face picture information.
Request URI Definition
Table 5-5 GET /ISAPI/AccessControl/CaptureFaceData/capabilities
MethodGET
DescriptionGet the capability of collecting face picture information.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_CaptureFaceData
Failed: XML_ResponseStatus
5.2.5 /ISAPI/AccessControl/CaptureFaceData/Progress
Get the progress of collecting face picture information.
Request URI Definition
Table 5-6 GET /ISAPI/AccessControl/CaptureFaceData/Progress
MethodGET
DescriptionGet the progress of collecting face picture information.
QueryNone.
RequestNone.
ResponseSucceeded: XML_CaptureFaceData
Failed: XML_ResponseStatus
5.2.6 /ISAPI/AccessControl/CaptureFaceData/Progress/capabilities
Get capability of getting face picture collection progress.
Intelligent Security API (Access Control on Person) Developer Guide
## 72

Request URI Definition
Table 5-7 GET /ISAPI/AccessControl/CaptureFaceData/Progress/capabilities
MethodGET
DescriptionGet capability of getting face picture collection progress.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_CaptureFaceData
Failed: XML_ResponseStatus
5.2.7 /ISAPI/AccessControl/CaptureFingerPrint
Collect fingerprint information.
Request URI Definition
Table 5-8 POST /ISAPI/AccessControl/CaptureFingerPrint
MethodPOST
DescriptionCollect fingerprint information.
QueryNone.
RequestXML_CaptureFingerPrintCond
ResponseSucceeded: XML_CaptureFingerPrint
Failed: XML_ResponseStatus
5.2.8 /ISAPI/AccessControl/CaptureFingerPrint/capabilities
Get the fingerprint collection capability.
Request URI Definition
Table 5-9 GET /ISAPI/AccessControl/CaptureFingerPrint/capabilities
MethodGET
DescriptionGet the fingerprint collection capability.
QueryNone.
Intelligent Security API (Access Control on Person) Developer Guide
## 73

RequestNone.
ResponseSucceeded: XML_Cap_CaptureFingerPrint
Failed: XML_ResponseStatus
5.2.9 /ISAPI/AccessControl/CardInfo/capabilities?format=json
Get the card management capability.
Request URI Definition
Table 5-10 GET /ISAPI/AccessControl/CardInfo/capabilities?format=json
MethodGET
DescriptionGet the card management capability.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_CardInfo
Failed: JSON_ResponseStatus
5.2.10 /ISAPI/AccessControl/CardInfo/Count?format=json
Get the total number of the added cards.
Request URI Definition
Table 5-11 GET /ISAPI/AccessControl/CardInfo/Count?format=json
MethodGET
DescriptionGet the total number of the added cards.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_CardInfoCount
Failed: JSON_ResponseStatus
5.2.11 /ISAPI/AccessControl/CardInfo/Count?format=json&employeeNo=<ID>
Get the number of cards linked with a specific person.
Intelligent Security API (Access Control on Person) Developer Guide
## 74

Request URI Definition
Table 5-12 GET /ISAPI/AccessControl/CardInfo/Count?format=json&employeeNo=<ID>
MethodGET
DescriptionGet the number of cards linked with a specific person.
Queryformat: determine the format of request or response message.
employeeNo: employee No.
RequestNone.
ResponseSucceeded: JSON_CardInfoCount
Failed: JSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the actual person ID or employee No.
5.2.12 /ISAPI/AccessControl/CardInfo/Delete?format=json
Delete cards.
Request URI Definition
Table 5-13 PUT /ISAPI/AccessControl/CardInfo/Delete?format=json
MethodPUT
DescriptionDelete cards.
Queryformat: determine the format of request or response message.
RequestJSON_CardInfoDelCond
ResponseJSON_ResponseStatus
5.2.13 /ISAPI/AccessControl/CardInfo/Modify?format=json
Edit card information.
Request URI Definition
Table 5-14 PUT /ISAPI/AccessControl/CardInfo/Modify?format=json
MethodPUT
DescriptionEdit card information.
Intelligent Security API (Access Control on Person) Developer Guide
## 75

Queryformat: determine the format of request or response message.
RequestJSON_CardInfo
ResponseJSON_ResponseStatus
## Remarks
The employeeNo and cardNo in the request message JSON_CardInfo cannot be edited by calling
this URI. If the cardNo needs to be edited, you should
firstly delete this card and then create a new
one.
5.2.14 /ISAPI/AccessControl/CardInfo/Record?format=json
Add cards and link them with a person.
Request URI Definition
Table 5-15 POST /ISAPI/AccessControl/CardInfo/Record?format=json
MethodPOST
DescriptionAdd cards and link them with a person.
Queryformat: determine the format of request or response message.
RequestJSON_CardInfo
ResponseJSON_ResponseStatus
5.2.15 /ISAPI/AccessControl/CardInfo/Search?format=json
Search for cards.
Request URI Definition
Table 5-16 POST /ISAPI/AccessControl/CardInfo/Search?format=json
MethodPOST
DescriptionSearch for cards.
Queryformat: determine the format of request or response message.
RequestJSON_CardInfoSearchCond
ResponseJSON_CardInfoSearch
Intelligent Security API (Access Control on Person) Developer Guide
## 76

5.2.16 /ISAPI/AccessControl/CardInfo/SetUp?format=json
Set card information.
Request URI Definition
Table 5-17 PUT /ISAPI/AccessControl/CardInfo/SetUp?format=json
MethodPUT
DescriptionSet card information.
Queryformat: determine the format of request or response message.
RequestJSON_CardInfo
ResponseJSON_ResponseStatus
## Remarks
•If the device has checked that the card does not exist according to the card No., the card
information will be added.
•If the device has checked that the card already exists according to the card No., the card
information will be edited.
•If you want to delete a card for a person, you should set the employeeNo and cardNo, and set
the deleteCard to "true" in the message JSON_CardInfo . The success response message will be
returned no
matter whether the card exists or not. Deleting the card will only delete the card's
information and will not delete the linked person information.
•If you want to delete all cards for a person, you should set the employeeNo, and set the
deleteCard to "true" in the message JSON_CardInfo . The success response message will be
returned no
matter whether the person exists or not or whether the person has cards or not.
Deleting cards will only delete the cards' information and will not delete the linked person
information.
## 5.2.17
/ISAPI/AccessControl/FingerPrint/Delete/capabilities?format=json
Get the capability of deleting fingerprint data.
Request URI Definition
Table 5-18 GET /ISAPI/AccessControl/FingerPrint/Delete/capabilities?format=json
MethodGET
DescriptionGet the capability of deleting fingerprint data.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 77

RequestNone.
ResponseSucceeded: JSON_Cap_FingerPrintDelete
Failed: JSON_ResponseStatus
5.2.18 /ISAPI/AccessControl/FingerPrint/Delete?format=json
Start deleting the fingerprint data.
Request URI Definition
Table 5-19 PUT /ISAPI/AccessControl/FingerPrint/Delete?format=json
MethodPUT
DescriptionStart deleting the fingerprint data.
Queryformat: determine the format of request or response message.
RequestJSON_FingerPrintDelete
ResponseJSON_ResponseStatus
## Remarks
This URI is only used to start deleting. To judge whether the deleting is completed, you should call
the request URI /ISAPI/AccessControl/FingerPrint/DeleteProcess?format=json by GET method to
get the
deleting status.
5.2.19 /ISAPI/AccessControl/FingerPrint/DeleteProcess?format=json
Get the progress of deleting fingerprint data.
Request URI Definition
Table 5-20 GET /ISAPI/AccessControl/FingerPrint/DeleteProcess?format=json
MethodGET
DescriptionGet the progress of deleting fingerprint data.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_FingerPrintDeleteProcess
Failed: JSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 78

## Remarks
When starting deleting fingerprint data, this URI will be repeatedly called to get the deleting
progress until "success" or "failed" is returned by the parameter status in the message
JSON_FingerPrintDeleteProcess .
5.2.20 /ISAPI/AccessControl/FingerPrint/SetUp?format=json
Set the fingerprint parameters.
Request URI Definition
Table 5-21 POST /ISAPI/AccessControl/FingerPrint/SetUp?format=json
MethodPOST
DescriptionSet the fingerprint parameters.
Queryformat: determine the format of request or response message.
RequestJSON_FingerPrintCfg
ResponseJSON_FingerPrintStatus
## Remarks
•If the fingerData is not applied, it indicates editing fingerprint parameters instead of applying
fingerprint data to the fingerprint module.
•If the
fingerData is applied, the fingerprint data will be added if it does not exist in the
fingerprint module, or the original fingerprint data will be overwritten if it already exists in the
fingerprint module.
•There are four
different methods for deleting one or more fingerprints:
•To delete a specific fingerprint in a specific fingerprint module linked with a specific employee
No., the employeeNo, enableCardReader,
fingerPrintID, and deleteFingerPrint in the
message JSON_FingerPrintCfg should be
configured, and the success response message will
be returned no
matter whether the fingerprint exists or not.
•To delete a
specific fingerprint in all fingerprint modules linked with a specific employee No.,
the employeeNo, fingerPrintID, and deleteFingerPrint in the message JSON_FingerPrintCfg
should be
configured, and the success response message will be returned no matter whether
the fingerprints exist or not.
•To delete all
fingerprints in a specific fingerprint module linked with a specific employee No.,
the employeeNo, enableCardReader, and deleteFingerPrint in the message
JSON_FingerPrintCfg should be
configured, and the success response message will be
returned no matter whether the fingerprints exist or not.
•To delete all
fingerprints in all fingerprint modules linked with a specific employee No., the
employeeNo and deleteFingerPrint in the message JSON_FingerPrintCfg should be
Intelligent Security API (Access Control on Person) Developer Guide
## 79

configured, and the success response message will be returned no matter whether the
fingerprints exist or not.
5.2.21 /ISAPI/AccessControl/FingerPrintCfg/capabilities?format=json
Get the configuration capability of fingerprint parameters.
Request URI Definition
Table 5-22 GET /ISAPI/AccessControl/FingerPrintCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of fingerprint parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_FingerPrintCfg
Failed: JSON_ResponseStatus
5.2.22 /ISAPI/AccessControl/FingerPrintDownload?format=json
Set fingerprint parameters to link with a person, and apply the collected fingerprint data.
Request URI Definition
Table 5-23 POST /ISAPI/AccessControl/FingerPrintDownload?format=json
MethodPOST
DescriptionSet fingerprint parameters to link with a person, and apply the
collected fingerprint data.
Queryformat: determine the format of request or response message.
RequestJSON_FingerPrintCfg +fingerprint data (by boundary method)
ResponseJSON_ResponseStatus
## Remarks
This URI is only used to start applying the fingerprint data. To check whether the applying is
completed, you should call the request URI /ISAPI/AccessControl/FingerPrintProgress?
format=json by GET method to get the applying status.
Intelligent Security API (Access Control on Person) Developer Guide
## 80

5.2.23 /ISAPI/AccessControl/FingerPrintModify?format=json
Edit fingerprint parameters.
Request URI Definition
Table 5-24 POST /ISAPI/AccessControl/FingerPrintModify?format=json
MethodPOST
DescriptionEdit fingerprint parameters.
Queryformat: determine the format of request or response message.
RequestJSON_FingerPrintModify
ResponseJSON_ResponseStatus
## Remarks
Only the fingerprint parameters can be edited. The collected fingerprint data will not be edited and
applied.
5.2.24 /ISAPI/AccessControl/FingerPrintProgress?format=json
Get the progress of applying fingerprint data.
Request URI Definition
Table 5-25 GET /ISAPI/AccessControl/FingerPrintProgress?format=json
MethodGET
DescriptionGet the progress of applying fingerprint data.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_FingerPrintStatus
Failed: JSON_ResponseStatus
## Remarks
When starting applying fingerprint data, this URI will be repeatedly called to get the applying
progress
until "1" is returned by the parameter totalStatus in the message
JSON_FingerPrintStatus .
Intelligent Security API (Access Control on Person) Developer Guide
## 81

5.2.25 /ISAPI/AccessControl/FingerPrintUpload?format=json
Get the fingerprint information, including fingerprint parameters and data.
Request URI Definition
Table 5-26 POST /ISAPI/AccessControl/FingerPrintUpload?format=json
MethodPOST
DescriptionGet the fingerprint information, including fingerprint parameters and
data.
Queryformat: determine the format of request or response message.
RequestJSON_FingerPrintCond
ResponseJSON_FingerPrintInfo +fingerprint data (by boundary method)
## Remarks
•To get the information of a specific fingerprint, the searchID, employeeNo, cardReaderNo, and
fingerPrintID in the message JSON_FingerPrintCond should be configured. If the fingerprint
matching the search conditions exists, the status will be set to "OK" and the corresponding
fingerprint information will be returned by FingerPrintList in the message
JSON_FingerPrintInfo ; otherwise, the status will be set to "NoFP" and the FingerPrintList will be
set to NULL in the message JSON_FingerPrintInfo .
•To get all
fingerprints linked with a specific employee No. (person ID), the searchID and
employeeNo in the message JSON_FingerPrintCond should be
configured. If the fingerprints
matching the search conditions exist, the status will be set to "OK" and the corresponding
fingerprint information will be returned by FingerPrintList in the message
JSON_FingerPrintInfo . The request URI /ISAPI/AccessControl/FingerPrintUpload?format=json
will be repeatedly called by POST method to get the
information of multiple fingerprints
matching the search conditions until "NoFP" is returned by status in the message
JSON_FingerPrintInfo (it indicates that information of all fingerprints matching the search
conditions are obtained). If there is no fingerprint matching the search conditions, the status will
be set to "NoFP" and the FingerPrintList will be set to NULL in the message
JSON_FingerPrintInfo .
5.2.26 /ISAPI/AccessControl/FingerPrintUploadAll?format=json
Get all
fingerprints' information (including fingerprint parameters and data) of a specific person.
Intelligent Security API (Access Control on Person) Developer Guide
## 82

Request URI Definition
Table 5-27 POST /ISAPI/AccessControl/FingerPrintUploadAll?format=json
MethodPOST
DescriptionGet all fingerprints' information (including fingerprint parameters and
data) of a specific person.
Queryformat: determine the format of request or response message.
RequestJSON_FingerPrintCondAll
ResponseJSON_FingerPrintInfoAll +fingerprint data (by boundary method)
5.2.27 /ISAPI/AccessControl/UserInfo/capabilities?format=json
Get the person management capability.
Request URI Definition
Table 5-28 GET /ISAPI/AccessControl/UserInfo/capabilities?format=json
MethodGET
DescriptionGet the person management capability.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_UserInfo
Failed: JSON_ResponseStatus
5.2.28 /ISAPI/AccessControl/UserInfo/Count?format=json
Get the total number of the added persons.
Request URI Definition
Table 5-29 GET /ISAPI/AccessControl/UserInfo/Count?format=json
MethodGET
DescriptionGet the total number of the added persons.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_UserInfoCount
Intelligent Security API (Access Control on Person) Developer Guide
## 83

Failed: JSON_ResponseStatus
5.2.29 /ISAPI/AccessControl/UserInfo/Delete?format=json
Delete person information only.
Request URI Definition
Table 5-30 PUT /ISAPI/AccessControl/UserInfo/Delete?format=json
MethodPUT
DescriptionDelete person information only.
Queryformat: determine the format of request or response message.
RequestJSON_UserInfoDelCond
ResponseJSON_ResponseStatus
5.2.30 /ISAPI/AccessControl/UserInfo/Modify?format=json
Edit person information.
Request URI Definition
Table 5-31 PUT /ISAPI/AccessControl/UserInfo/Modify?format=json
MethodPUT
DescriptionEdit person information.
Queryformat: determine the format of request or response message.
RequestJSON_UserInfo
ResponseJSON_ResponseStatus
5.2.31 /ISAPI/AccessControl/UserInfo/Record?format=json
Add a person.
Request URI Definition
Table 5-32 POST /ISAPI/AccessControl/UserInfo/Record?format=json
MethodPOST
DescriptionAdd a person.
Intelligent Security API (Access Control on Person) Developer Guide
## 84

Queryformat: determine the format of request or response message.
RequestJSON_UserInfo
ResponseJSON_ResponseStatus
5.2.32 /ISAPI/AccessControl/UserInfo/Search?format=json
Search for person information.
Request URI Definition
Table 5-33 POST /ISAPI/AccessControl/UserInfo/Search?format=json
MethodPOST
DescriptionSearch for person information.
Queryformat: determine the format of request or response message.
RequestJSON_UserInfoSearchCond
ResponseJSON_UserInfoSearch
## Remarks
The Request (user information search condition JSON_UserInfoSearchCond ) depends on the user
information capability JSON_Cap_UserInfo (related node: <UserInfoSearchCond>).
5.2.33 /ISAPI/AccessControl/UserInfo/SetUp?format=json
Set person information.
Request URI Definition
Table 5-34 PUT /ISAPI/AccessControl/UserInfo/SetUp?format=json
MethodPUT
DescriptionSet person information.
Queryformat: determine the format of request or response message.
RequestJSON_UserInfo
ResponseJSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 85

## Remarks
•If the device has checked that the person does not exist according to the employee No. (person
ID), the person information will be added.
•If the device has checked that the person already exists according to the employee No. (person
ID), the person information will be edited.
•If a person needs to be deleted, the deleteUser in the message JSON_UserInfo should be set to
"true", and the success response message will be returned no
matter whether the person
information exists or not. Deleting the person will only delete the person's information and will
not delete the linked cards, fingerprints, and face information.
5.2.34 /ISAPI/AccessControl/UserInfoDetail/Delete/capabilities?format=json
Get the capability of deleting person information (including linked cards, fingerprints, and faces)
and permissions.
Request URI Definition
Table 5-35 GET /ISAPI/AccessControl/UserInfoDetail/Delete/capabilities?format=json
MethodGET
DescriptionGet the capability of deleting person information (including linked
cards, fingerprints, and faces) and permissions.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_UserInfoDetail
Failed: JSON_ResponseStatus
5.2.35 /ISAPI/AccessControl/UserInfoDetail/Delete?format=json
Start deleting all person information and permissions by employee No.
Request URI Definition
Table 5-36 PUT /ISAPI/AccessControl/UserInfoDetail/Delete?format=json
MethodPUT
DescriptionStart deleting all person information (including linked cards,
fingerprints, and faces) and permissions by employee No.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 86

RequestJSON_UserInfoDetail
ResponseJSON_ResponseStatus
## Remarks
This URI is only used to start deleting. To check whether the deleting is completed, you should call
the request URI /ISAPI/AccessControl/UserInfoDetail/DeleteProcess?format=json by GET method
to get the
deleting status.
5.2.36 /ISAPI/AccessControl/UserInfoDetail/DeleteProcess?format=json
Get the status of deleting all person information and permissions by employee No.
Request URI Definition
Table 5-37 GET /ISAPI/AccessControl/UserInfoDetail/DeleteProcess?format=json
MethodGET
DescriptionGet the status of deleting all person information (including linked
cards, fingerprints, and faces) and permissions by employee No.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_UserInfoDetailDeleteProcess
Failed: JSON_ResponseStatus
## Remarks
When starting deleting all person information (including linked cards, fingerprints, and faces) and
permissions by employee No., this URI will be repeatedly called to get the
deleting status until
"success" or "failed" is returned by the parameter status in the message
JSON_UserInfoDetailDeleteProcess .
## 5.3 Access Control Resource
## Settings
5.3.1 /ISAPI/AccessControl/AcsCfg/capabilities?format=json
Get the configuration capability of the access controller.
Intelligent Security API (Access Control on Person) Developer Guide
## 87

Request URI Definition
Table 5-38 GET /ISAPI/AccessControl/AcsCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the access controller.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AcsCfg
Failed: JSON_ResponseStatus
5.3.2 /ISAPI/AccessControl/AcsCfg?format=json
Operations about the configuration of the access controller.
Request URI Definition
Table 5-39 GET /ISAPI/AccessControl/AcsCfg?format=json
MethodGET
DescriptionGet the configuration parameters of the access controller.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_AcsCfg
Failed: JSON_ResponseStatus
Table 5-40 PUT /ISAPI/AccessControl/AcsCfg?format=json
MethodPUT
DescriptionSet the parameters of the access controller.
Queryformat: determine the format of request or response message.
RequestJSON_AcsCfg
ResponseJSON_ResponseStatus
5.3.3 /ISAPI/AccessControl/AntiSneakCfg/capabilities?format=json
Get the anti-passing back configuration capability.
Intelligent Security API (Access Control on Person) Developer Guide
## 88

Request URI Definition
Table 5-41 GET /ISAPI/AccessControl/AntiSneakCfg/capabilities?format=json
MethodGET
DescriptionGet the anti-​passing back configuration capability.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AntiSneakCfg
Failed: JSON_ResponseStatus
5.3.4 /ISAPI/AccessControl/AntiSneakCfg?format=json
Operations about anti-passing back configuration.
Request URI Definition
Table 5-42 GET /ISAPI/AccessControl/AntiSneakCfg?format=json
MethodGET
DescriptionGet the anti-​passing back configuration parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_AntiSneakCfg
Failed: JSON_ResponseStatus
Table 5-43 PUT /ISAPI/AccessControl/AntiSneakCfg?format=json
MethodPUT
DescriptionSet the anti-​passing back parameters.
Queryformat: determine the format of request or response message.
RequestJSON_AntiSneakCfg
ResponseJSON_ResponseStatus
5.3.5 /ISAPI/AccessControl/attendanceStatusModeCfg/capabilities?format=json
Get the configuration capability of the attendance mode.
Intelligent Security API (Access Control on Person) Developer Guide
## 89

Request URI Definition
Table 5-44 GET /ISAPI/AccessControl/attendanceStatusModeCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the attendance mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AttendanceStatusModeCfg
Failed: JSON_ResponseStatus
5.3.6 /ISAPI/AccessControl/attendanceStatusModeCfg?format=json
Operations about the attendance mode configuration.
Request URI Definition
Table 5-45 GET /ISAPI/AccessControl/attendanceStatusModeCfg?format=json
MethodGET
DescriptionGet the attendance mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_AttendanceStatusModeCfg
Failed: JSON_ResponseStatus
Table 5-46 PUT /ISAPI/AccessControl/attendanceStatusModeCfg?format=json
MethodPUT
DescriptionSet the attendance mode.
Queryformat: determine the format of request or response message.
RequestJSON_AttendanceStatusModeCfg
ResponseJSON_ResponseStatus
5.3.7 /ISAPI/AccessControl/attendanceStatusRuleCfg/capabilities?format=json
Get the configuration capability of the attendance status and rule.
Intelligent Security API (Access Control on Person) Developer Guide
## 90

Request URI Definition
Table 5-47 GET /ISAPI/AccessControl/attendanceStatusRuleCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the attendance status and rule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AttendanceStatusRuleCfg
Failed: JSON_ResponseStatus
5.3.8 /ISAPI/AccessControl/attendanceStatusRuleCfg?
attendanceStatus=&format=json
Operations about the configuration of the attendance status and rule.
Request URI Definition
Table 5-48 GET /ISAPI/AccessControl/attendanceStatusRuleCfg?attendanceStatus=&format=json
MethodGET
DescriptionGet the attendance status and rule.
Queryformat: determine the format of request or response message.
attendanceStatus: attendance status, it can be set to one of the
following values: "checkIn"-check in, "checkOut"-check out,
"breakOut"-break out, "breakIn"-break in,
"overtimeIn"-​overtime in,
"overtimeOut"-​overtime out, e.g., /ISAPI/AccessControl/
attendanceStatusRuleCfg?attendanceStatus=checkIn&format=json
## .
RequestNone.
ResponseSucceeded: JSON_AttendanceStatusRuleCfg
Failed: JSON_ResponseStatus
Table 5-49 PUT /ISAPI/AccessControl/attendanceStatusRuleCfg?attendanceStatus=&format=json
MethodPUT
DescriptionSet the attendance status and rule.
Queryformat: determine the format of request or response message.
attendanceStatus: attendance status, it can be set to one of the
following values: "checkIn"-check in, "checkOut"-check out,
Intelligent Security API (Access Control on Person) Developer Guide
## 91

"breakOut"-break out, "breakIn"-break in, "overtimeIn"-​overtime in,
"overtimeOut"-​overtime out, e.g., /ISAPI/AccessControl/
attendanceStatusRuleCfg?attendanceStatus=checkIn&format=json.
RequestJSON_AttendanceStatusRuleCfg
ResponseJSON_ResponseStatus
5.3.9 /ISAPI/AccessControl/CardReaderAntiSneakCfg/<ID>?format=json
Operations about the anti-passing back configuration of a specified card reader.
Request URI Definition
Table 5-50 GET /ISAPI/AccessControl/CardReaderAntiSneakCfg/<ID>?format=json
MethodGET
DescriptionGet the anti-​passing back configuration parameters of a specified
card reader.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_CardReaderAntiSneakCfg
Failed: JSON_ResponseStatus
Table 5-51 PUT /ISAPI/AccessControl/CardReaderAntiSneakCfg/<ID>?format=json
MethodPUT
DescriptionSet the anti-​passing back parameters of a specified card reader.
Queryformat: determine the format of request or response message.
RequestJSON_CardReaderAntiSneakCfg
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the card reader No.
## 5.3.10
/ISAPI/AccessControl/CardReaderAntiSneakCfg/capabilities?format=json
Get the anti-passing back configuration capability of card readers.
Intelligent Security API (Access Control on Person) Developer Guide
## 92

Request URI Definition
Table 5-52 GET /ISAPI/AccessControl/CardReaderAntiSneakCfg/capabilities?format=json
MethodGET
DescriptionGet the anti-​passing back configuration capability of card readers.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_CardReaderAntiSneakCfg
Failed: JSON_ResponseStatus
5.3.11 /ISAPI/AccessControl/CardReaderCfg/<ID>?format=json
Operations about the card reader configuration.
Request URI Definition
Table 5-53 GET /ISAPI/AccessControl/CardReaderCfg/<ID>?format=json
MethodGET
DescriptionGet the card reader configuration parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_CardReaderCfg
Failed: JSON_ResponseStatus
Table 5-54 PUT /ISAPI/AccessControl/CardReaderCfg/<ID>?format=json
MethodPUT
DescriptionSet the card reader parameters.
Queryformat: determine the format of request or response message.
RequestJSON_CardReaderCfg
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the card reader No. which starts from 1.
Intelligent Security API (Access Control on Person) Developer Guide
## 93

5.3.12 /ISAPI/AccessControl/CardReaderCfg/capabilities?format=json
Get the configuration capability of the card reader.
Request URI Definition
Table 5-55 GET /ISAPI/AccessControl/CardReaderCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the card reader.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_CardReaderCfg
Failed: JSON_ResponseStatus
5.3.13 /ISAPI/AccessControl/ClearAntiSneakCfg/capabilities?format=json
Get the capability of clearing anti-passing back parameters.
Request URI Definition
Table 5-56 GET /ISAPI/AccessControl/ClearAntiSneakCfg/capabilities?format=json
MethodGET
DescriptionGet the capability of clearing anti-​passing back parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_ClearAntiSneakCfg
Failed: JSON_ResponseStatus
5.3.14 /ISAPI/AccessControl/ClearAntiSneakCfg?format=json
Clear anti-passing back parameters.
Request URI Definition
Table 5-57 PUT /ISAPI/AccessControl/ClearAntiSneakCfg?format=json
MethodPUT
DescriptionClear anti-​passing back parameters.
Intelligent Security API (Access Control on Person) Developer Guide
## 94

Queryformat: determine the format of request or response message.
RequestJSON_ClearAntiSneakCfg
ResponseJSON_ResponseStatus
5.3.15 /ISAPI/AccessControl/ClearGroupCfg/capabilities?format=json
Get the capability of clearing group configuration.
Request URI Definition
Table 5-58 GET /ISAPI/AccessControl/ClearGroupCfg/capabilities?format=json
MethodGET
DescriptionGet the capability of clearing group configuration.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_ClearGroupCfg
Failed: JSON_ResponseStatus
5.3.16 /ISAPI/AccessControl/ClearGroupCfg?format=json
Clear the group configuration.
Request URI Definition
Table 5-59 PUT /ISAPI/AccessControl/ClearGroupCfg?format=json
MethodPUT
DescriptionClear the group configuration parameters.
Queryformat: determine the format of request or response message.
RequestJSON_ClearGroupCfg
ResponseJSON_ResponseStatus
5.3.17 /ISAPI/AccessControl/Configuration/lockType/capabilities?format=json
Get the configuration capability of the door lock status when the device is powered off.
Intelligent Security API (Access Control on Person) Developer Guide
## 95

Request URI Deification
Table 5-60 GET /ISAPI/AccessControl/Configuration/lockType/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the door lock status when the
device is powered off.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_LockTypeCap
Failed: JSON_ResponseStatus
5.3.18 /ISAPI/AccessControl/Configuration/lockType?format=json
Get or set the door lock status when the device is powered off.
Request URI Definition
Table 5-61 GET /ISAPI/AccessControl/Configuration/lockType?format=json
MethodGET
DescriptionGet the door lock status when the device is powered off.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_LockType
Failed: JSON_ResponseStatus
Table 5-62 PUT /ISAPI/AccessControl/Configuration/lockType?format=json
MethodPUT
DescriptionSet the door lock status when the device is powered off.
Queryformat: determine the format of request or response message.
RequestJSON_LockType
ResponseJSON_ResponseStatus
5.3.19 /ISAPI/AccessControl/Configuration/NFCCfg/capabilities?format=json
Get the configuration capability of enabling NFC (Near-Field Communication) function.
Intelligent Security API (Access Control on Person) Developer Guide
## 96

Request URI Definition
Table 5-63 GET /ISAPI/AccessControl/Configuration/NFCCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of enabling NFC (Near-Field
Communication) function.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_NFCCfgCap
Failed: JSON_ResponseStatus
5.3.20 /ISAPI/AccessControl/Configuration/NFCCfg?format=json
Operations about the configuration of enabling NFC (Near-Field Communication) function.
Request URI Definition
Table 5-64 GET /ISAPI/AccessControl/Configuration/NFCCfg?format=json
MethodGET
DescriptionGet the parameters of enabling NFC (Near-Field Communication)
function.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_NFCCfg
Failed: JSON_ResponseStatus
Table 5-65 PUT /ISAPI/AccessControl/Configuration/NFCCfg?format=json
MethodPUT
DescriptionSet the parameters of enabling NFC (Near-Field Communication)
function.
Queryformat: determine the format of request or response message.
RequestJSON_NFCCfg
ResponseJSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 97

5.3.21 /ISAPI/AccessControl/Configuration/RFCardCfg/capabilities?format=json
Get the configuration capability of enabling RF (Radio Frequency) card recognition.
Request URI Definition
Table 5-66 GET /ISAPI/AccessControl/Configuration/RFCardCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of enabling RF (Radio Frequency)
card recognition.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_RFCardCfgCap
Failed: JSON_ResponseStatus
5.3.22 /ISAPI/AccessControl/Configuration/RFCardCfg?format=json
Operations about the configuration of enabling RF (Radio Frequency) card recognition.
Request URI Definition
Table 5-67 GET /ISAPI/AccessControl/Configuration/RFCardCfg?format=json
MethodGET
DescriptionGet the parameters of enabling RF (Radio Frequency) card
recognition.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_RFCardCfg
Failed: JSON_ResponseStatus
Table 5-68 PUT /ISAPI/AccessControl/Configuration/RFCardCfg?format=json
MethodPUT
DescriptionSet the parameters of enabling RF (Radio Frequency) card
recognition.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 98

RequestJSON_RFCardCfg
ResponseJSON_ResponseStatus
5.3.23 /ISAPI/AccessControl/Door/param/<ID>
Operations about the door (floor) configuration.
Request URI Definition
Table 5-69 GET /ISAPI/AccessControl/Door/param/<ID>
MethodGET
DescriptionGet the door (floor) configuration parameters.
QueryNone.
RequestNone.
ResponseSucceeded: XML_DoorParam
Failed: XML_ResponseStatus
Table 5-70 PUT /ISAPI/AccessControl/Door/param/<ID>
MethodPUT
DescriptionSet the door (floor) parameters.
QueryNone.
RequestXML_DoorParam
ResponseXML_ResponseStatus
## Remarks
The <ID> in the request URI refers to the door No. (floor No.) which starts from 1.
## 5.3.24
/ISAPI/AccessControl/Door/param/<ID>/capabilities
Get the door (floor) configuration capability.
Request URI Definition
Table 5-71 GET /ISAPI/AccessControl/Door/param/<ID>/capabilities
MethodGET
DescriptionGet the door (floor) configuration capability.
QueryNone.
Intelligent Security API (Access Control on Person) Developer Guide
## 99

RequestNone.
ResponseSucceeded: XML_Cap_DoorParam
Failed: XML_ResponseStatus
## Remarks
The <ID> in the request URI refers to the door No. (floor No.) which starts from 1.
5.3.25 /ISAPI/AccessControl/FaceCompareCond
Get or set the condition parameters of face picture comparison.
Request URI Definition
Table 5-72 GET /ISAPI/AccessControl/FaceCompareCond
MethodGET
DescriptionGet the condition parameters of face picture comparison.
QueryNone.
RequestNone.
ResponseSucceeded: XML_FaceCompareCond
Failed: XML_ResponseStatus
Table 5-73 PUT /ISAPI/AccessControl/FaceCompareCond
MethodPUT
DescriptionSet the condition parameters of face picture comparison.
QueryNone.
RequestXML_FaceCompareCond
ResponseXML_ResponseStatus
5.3.26 /ISAPI/AccessControl/FaceCompareCond/capabilities
Get condition configuration capability of face picture comparison.
Request URI Definition
Table 5-74 GET /ISAPI/AccessControl/FaceCompareCond/capabilities
MethodGET
DescriptionGet condition configuration capability of face picture comparison.
Intelligent Security API (Access Control on Person) Developer Guide
## 100

QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_FaceCompareCond
Failed: XML_ResponseStatus
5.3.27 /ISAPI/AccessControl/FaceRecognizeMode/capabilities?format=json
Get the configuration capability of the facial recognition mode.
Request URI Definition
Table 5-75 GET /ISAPI/AccessControl/FaceRecognizeMode/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the facial recognition mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_FaceRecognizeMode
Failed: JSON_ResponseStatus
## Remarks
Switching facial recognition mode will clear face permission information in the device.
5.3.28 /ISAPI/AccessControl/FaceRecognizeMode?format=json
Operations about the configuration of the facial recognition mode.
Request URI Definition
Table 5-76 GET /ISAPI/AccessControl/FaceRecognizeMode?format=json
MethodGET
DescriptionGet the parameters of the facial recognition mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_FaceRecognizeMode
Failed: JSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 101

Table 5-77 PUT /ISAPI/AccessControl/FaceRecognizeMode?format=json
MethodPUT
DescriptionSet the parameters of the facial recognition mode.
Queryformat: determine the format of request or response message.
RequestJSON_FaceRecognizeMode
ResponseJSON_ResponseStatus
## Remarks
Switching facial recognition mode will clear face permission information in the device.
5.3.29 /ISAPI/AccessControl/GroupCfg/<ID>?format=json
Operations about the group configuration.
Request URI Definition
Table 5-78 GET /ISAPI/AccessControl/GroupCfg/<ID>?format=json
MethodGET
DescriptionGet the group configuration parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_GroupCfg
Failed: JSON_ResponseStatus
Table 5-79 PUT /ISAPI/AccessControl/GroupCfg/<ID>?format=json
MethodPUT
DescriptionSet the group parameters.
Queryformat: determine the format of request or response message.
RequestJSON_GroupCfg
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the group No. which starts from 1.
Intelligent Security API (Access Control on Person) Developer Guide
## 102

5.3.30 /ISAPI/AccessControl/GroupCfg/capabilities?format=json
Get the group configuration capability.
Request URI Definition
Table 5-80 GET /ISAPI/AccessControl/GroupCfg/capabilities?format=json
MethodGET
DescriptionGet the group configuration capability.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_GroupCfg
Failed: JSON_ResponseStatus
5.3.31 /ISAPI/AccessControl/IDBlackListCfg
Apply ID card blacklist.
Request URI Definition
Table 5-81 PUT /ISAPI/AccessControl/IDBlackListCfg
MethodPUT
DescriptionApply ID card blacklist.
QueryNone.
RequestXML_IDBlackListCfg
ResponseXML_ResponseStatus
5.3.32 /ISAPI/AccessControl/IDBlackListCfg/capabilities
Get capability of applying ID card blacklist.
Request URI Definition
Table 5-82 GET /ISAPI/AccessControl/IDBlackListCfg/capabilities
MethodGET
DescriptionGet capability of applying ID card blacklist.
QueryNone.
Intelligent Security API (Access Control on Person) Developer Guide
## 103

RequestNone.
ResponseSucceeded: XML_Cap_IDBlackListCfg
Failed: XML_ResponseStatus
5.3.33 /ISAPI/AccessControl/IdentityTerminal
Operations about configuration of intelligent identity recognition terminal.
Request URI Definition
Table 5-83 GET /ISAPI/AccessControl/IdentityTerminal
MethodGET
DescriptionGet the configuration parameters of intelligent identity recognition
terminal.
QueryNone.
RequestNone.
ResponseSucceeded: XML_IdentityTerminal
Failed: XML_ResponseStatus
Table 5-84 PUT /ISAPI/AccessControl/IdentityTerminal
MethodPUT
DescriptionSet the parameters of intelligent identity recognition terminal.
QueryNone.
RequestXML_IdentityTerminal
ResponseXML_ResponseStatus
5.3.34 /ISAPI/AccessControl/IdentityTerminal/capabilities
Get configuration capability of intelligent identity recognition terminal.
Request URI Definition
Table 5-85 GET /ISAPI/AccessControl/IdentityTerminal/capabilities
MethodGET
DescriptionGet configuration capability of intelligent identity recognition
terminal.
Intelligent Security API (Access Control on Person) Developer Guide
## 104

QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_IdentityTerminal
Failed: XML_ResponseStatus
5.3.35 /ISAPI/AccessControl/LogModeCfg/capabilities?format=json
Get the configuration capability of the log mode.
Request URI Definition
Table 5-86 GET /ISAPI/AccessControl/LogModeCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the log mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_LogModeCfg
Failed: JSON_ResponseStatus
5.3.36 /ISAPI/AccessControl/LogModeCfg?format=json
Operations about the log mode configuration.
Request URI Definition
Table 5-87 GET /ISAPI/AccessControl/LogModeCfg?format=json
MethodGET
DescriptionGet the log mode configuration parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_LogModeCfg
Failed: JSON_ResponseStatus
Table 5-88 PUT /ISAPI/AccessControl/LogModeCfg?format=json
MethodPUT
DescriptionSet the log mode parameters.
Intelligent Security API (Access Control on Person) Developer Guide
## 105

Queryformat: determine the format of request or response message.
RequestJSON_LogModeCfg
ResponseJSON_ResponseStatus
5.3.37 /ISAPI/AccessControl/M1CardEncryptCfg
Operations about the configuration of M1 card encryption verification.
Request URI Definition
Table 5-89 GET /ISAPI/AccessControl/M1CardEncryptCfg
MethodGET
DescriptionGet the configuration parameters of M1 card encryption verification.
QueryNone.
RequestNone.
ResponseSucceeded: XML_M1CardEncryptCfg
Failed: XML_ResponseStatus
Table 5-90 PUT /ISAPI/AccessControl/M1CardEncryptCfg
MethodPUT
DescriptionSet the parameters of M1 card encryption verification.
QueryNone.
RequestXML_M1CardEncryptCfg
ResponseXML_ResponseStatus
## Remarks
This request URI is used to notify the device that data of which sector is encrypted by M1 card and
will not execute the
encryption function.
## 5.3.38
/ISAPI/AccessControl/M1CardEncryptCfg/capabilities
Get the configuration capability of M1 card encryption verification.
Intelligent Security API (Access Control on Person) Developer Guide
## 106

Request URI Definition
Table 5-91 GET /ISAPI/AccessControl/M1CardEncryptCfg/capabilities
MethodGET
DescriptionGet the configuration capability of M1 card encryption verification.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_M1CardEncryptCfg
Failed: XML_ResponseStatus
5.3.39 /ISAPI/AccessControl/MultiCardCfg/<ID>?format=json
Operations about the configuration of multi-factor authentication mode.
Request URI Definition
Table 5-92 GET /ISAPI/AccessControl/MultiCardCfg/<ID>?format=json
MethodGET
DescriptionGet the configuration parameters of multi-​factor authentication
mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_MultiCardCfg
Failed: JSON_ResponseStatus
Table 5-93 PUT /ISAPI/AccessControl/MultiCardCfg/<ID>?format=json
MethodPUT
DescriptionSet the parameters of multi-​factor authentication mode.
Queryformat: determine the format of request or response message.
RequestJSON_MultiCardCfg
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the door No. which starts from 1.
Intelligent Security API (Access Control on Person) Developer Guide
## 107

5.3.40 /ISAPI/AccessControl/MultiCardCfg/capabilities?format=json
Get the configuration capability of multi-factor authentication mode.
Request URI Definition
Table 5-94 GET /ISAPI/AccessControl/MultiCardCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of multi-​factor authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_MultiCardCfg
Failed: JSON_ResponseStatus
5.3.41 /ISAPI/AccessControl/MultiDoorInterLockCfg/capabilities?format=json
Get the configuration capability of the multi-door interlocking.
Request URI Definition
Table 5-95 GET /ISAPI/AccessControl/MultiDoorInterLockCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the multi-​door interlocking.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_MultiDoorInterLockCfg
Failed: JSON_ResponseStatus
5.3.42 /ISAPI/AccessControl/MultiDoorInterLockCfg?format=json
Operations about the multi-door interlocking configuration.
Request URI Definition
Table 5-96 GET /ISAPI/AccessControl/MultiDoorInterLockCfg?format=json
MethodGET
DescriptionGet the multi-​door interlocking configuration parameters.
Intelligent Security API (Access Control on Person) Developer Guide
## 108

Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_MultiDoorInterLockCfg
Failed: JSON_ResponseStatus
Table 5-97 PUT /ISAPI/AccessControl/MultiDoorInterLockCfg?format=json
MethodPUT
DescriptionSet the multi-​door interlocking parameters.
Queryformat: determine the format of request or response message.
RequestJSON_MultiDoorInterLockCfg
ResponseJSON_ResponseStatus
5.3.43 /ISAPI/AccessControl/OSDPModify/<ID>?format=json
Set the OSDP (Open Supervised Device Protocol) card reader ID.
Request URI Definition
Table 5-98 PUT /ISAPI/AccessControl/OSDPModify/<ID>?format=json
MethodPUT
DescriptionSet the OSDP (Open Supervised Device Protocol) card reader ID.
Queryformat: determine the format of request or response message.
RequestJSON_OSDPModify
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the original OSDP card reader ID which is between 0 and 126,
and 127 refers to broadcast.
## 5.3.44
/ISAPI/AccessControl/OSDPModify/capabilities?format=json
Get the capability of editing the OSDP (Open Supervised Device Protocol) card reader ID.
Intelligent Security API (Access Control on Person) Developer Guide
## 109

Request URI Definition
Table 5-99 GET /ISAPI/AccessControl/OSDPModify/capabilities?format=json
MethodGET
DescriptionGet the capability of editing the OSDP (Open Supervised Device
Protocol) card reader ID.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_OSDPModify
Failed: JSON_ResponseStatus
5.3.45 /ISAPI/AccessControl/PhoneDoorRightCfg/<ID>?format=json
Operations about the configuration of the door permission linked to the mobile phone number.
Request URI Definition
Table 5-100 GET /ISAPI/AccessControl/PhoneDoorRightCfg/<ID>?format=json
MethodGET
DescriptionGet the configuration parameters of the door permission linked to
the mobile phone number.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_PhoneDoorRightCfg
Failed: JSON_ResponseStatus
Table 5-101 PUT /ISAPI/AccessControl/PhoneDoorRightCfg/<ID>?format=json
MethodPUT
DescriptionSet the parameters of the door permission linked to the mobile
phone number.
Queryformat: determine the format of request or response message.
RequestJSON_PhoneDoorRightCfg
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the No. of the mobile phone number whitelist.
Intelligent Security API (Access Control on Person) Developer Guide
## 110

5.3.46 /ISAPI/AccessControl/PhoneDoorRightCfg/capabilities?format=json
Get the configuration capability of the door permission linked to the mobile phone number.
Request URI Definition
Table 5-102 GET /ISAPI/AccessControl/PhoneDoorRightCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the door permission linked to the
mobile phone number.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_PhoneDoorRightCfg
Failed: JSON_ResponseStatus
5.3.47 /ISAPI/AccessControl/ReaderAcrossHost
Operations about the cross-controller anti-passing back configuration of card readers.
Request URI Definition
Table 5-103 GET /ISAPI/AccessControl/ReaderAcrossHost
MethodGET
DescriptionGet the cross-controller anti-​passing back parameters of card
readers.
QueryNone.
RequestNone.
ResponseSucceeded: XML_ReaderAcrossHost
Failed: XML_ResponseStatus
Table 5-104 PUT /ISAPI/AccessControl/ReaderAcrossHost
MethodPUT
DescriptionSet the cross-controller anti-​passing back parameters of card readers.
QueryNone.
RequestXML_ReaderAcrossHost
ResponseXML_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 111

5.3.48 /ISAPI/AccessControl/ReaderAcrossHost/capabilities
Get the configuration capability of cross-controller anti-passing back status of card readers.
Request URI Definition
Table 5-105 GET /ISAPI/AccessControl/ReaderAcrossHost/capabilities
MethodGET
DescriptionGet the configuration capability of cross-controller anti-​passing back
status of card readers.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_ReaderAcrossHost
Failed: XML_ResponseStatus
5.3.49 /ISAPI/AccessControl/remoteControlPWCfg/capabilities?format=json
Get the capability of configuring password for remote door control.
Request URI Definition
Table 5-106 GET /ISAPI/AccessControl/remoteControlPWCfg/capabilities?format=json
MethodGET
DescriptionGet the capability of configuring password for remote door control.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_RemoteControlPWCfg
Failed: JSON_ResponseStatus
5.3.50 /ISAPI/AccessControl/remoteControlPWCfg/door/<ID>?format=json
Configure the password for remote door control.
Intelligent Security API (Access Control on Person) Developer Guide
## 112

Request URI Definition
Table 5-107 PUT /ISAPI/AccessControl/remoteControlPWCfg/door/<ID>?format=json
MethodPUT
DescriptionConfigure the password for remote door control.
Queryformat: determine the format of request or response message.
RequestJSON_RemoteControlPWCfg
ResponseJSON_ResponseStatus
## Remarks
•The <ID> in the request URI refers to the door No.
•The password for remote door control can be
configured only after the password is verified by
the request URI: PUT /ISAPI/AccessControl/remoteControlPWCheck/door/<ID>?format=json .
5.3.51 /ISAPI/AccessControl/ServerDevice
Operation about the configuration of cross-controller anti-passing back server information.
Request URI Definition
Table 5-108 GET /ISAPI/AccessControl/ServerDevice
MethodGET
DescriptionGet the information (i.e., IP address and port No.) of the cross-
controller anti-​passing back server.
QueryNone.
RequestNone.
ResponseSucceeded: XML_ServerDevice
Failed: XML_ResponseStatus
Table 5-109 PUT /ISAPI/AccessControl/ServerDevice
MethodPUT
DescriptionSet the information (i.e., IP address and port No.) of the cross-
controller anti-​passing back server.
QueryNone.
RequestXML_ServerDevice
ResponseXML_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 113

5.3.52 /ISAPI/AccessControl/ServerDevice/capabilities
Get the configuration capability of cross-controller anti-passing back server information.
Request URI Definition
Table 5-110 GET /ISAPI/AccessControl/ServerDevice/capabilities
MethodGET
DescriptionGet the configuration capability of cross-controller anti-​passing back
server information.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_ServerDevice
Failed: XML_ResponseStatus
5.3.53 /ISAPI/AccessControl/SmsRelativeParam/capabilities?format=json
Get the configuration capability of the SMS (Short Message Service) function.
Request URI Definition
Table 5-111 GET /ISAPI/AccessControl/SmsRelativeParam/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the SMS (Short Message Service)
function.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_SmsRelativeParam
Failed: JSON_ResponseStatus
5.3.54 /ISAPI/AccessControl/SmsRelativeParam?format=json
Operations about the SMS (Short Message Service) function configuration.
Intelligent Security API (Access Control on Person) Developer Guide
## 114

Request URI Definition
Table 5-112 GET /ISAPI/AccessControl/SmsRelativeParam?format=json
MethodGET
DescriptionGet the configuration parameters of the SMS (Short Message Service)
function.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_SmsRelativeParam
Failed: JSON_ResponseStatus
Table 5-113 PUT /ISAPI/AccessControl/SmsRelativeParam?format=json
MethodPUT
DescriptionSet the parameters of the SMS (Short Message Service) function.
Queryformat: determine the format of request or response message.
RequestJSON_SmsRelativeParam
ResponseJSON_ResponseStatus
5.3.55 /ISAPI/AccessControl/SnapConfig
Get capture triggering parameters.
Request URI Definition
Table 5-114 GET /ISAPI/AccessControl/SnapConfig
MethodGET
DescriptionGet capture triggering parameters.
QueryNone.
RequestNone.
ResponseSucceeded: XML_SnapConfig
Failed: XML_ResponseStatus
5.3.56 /ISAPI/AccessControl/SnapConfig/capabilities
Get capability of getting capture triggering parameters.
Intelligent Security API (Access Control on Person) Developer Guide
## 115

Request URI Definition
Table 5-115 GET /ISAPI/AccessControl/SnapConfig/capabilities
MethodGET
DescriptionGet capability of getting capture triggering parameters.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_SnapConfig
Failed: XML_ResponseStatus
5.3.57 /ISAPI/AccessControl/StartReaderInfo
Operations about first card reader configurations.
Request URI Definition
Table 5-116 GET /ISAPI/AccessControl/StartReaderInfo
MethodGET
DescriptionGet the configuration parameters of first card reader.
QueryNone.
RequestNone.
ResponseXML_StartReaderInfo
Table 5-117 PUT /ISAPI/AccessControl/StartReaderInfo
MethodPUT
DescriptionSet the parameters of first card reader.
QueryNone.
RequestXML_StartReaderInfo
ResponseXML_ResponseStatus
5.3.58 /ISAPI/AccessControl/StartReaderInfo/capabilities
Get the configuration capability of the first card reader.
Intelligent Security API (Access Control on Person) Developer Guide
## 116

Request URI Definition
Table 5-118 GET /ISAPI/AccessControl/StartReaderInfo/capabilities
MethodGET
DescriptionGet the configuration capability of the first card reader.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_StartReaderInfo
Failed: XML_ResponseStatus
5.3.59 /ISAPI/AccessControl/SubmarineBack
Operations about the configuration of the cross-controller anti-passing back server.
Request URI Definition
Table 5-119 GET /ISAPI/AccessControl/SubmarineBack
MethodGET
DescriptionGet the configuration parameters of the cross-controller anti-​passing
back server.
QueryNone.
RequestNone.
ResponseSucceeded: XML_SubmarineBack
Failed: XML_ResponseStatus
Table 5-120 PUT /ISAPI/AccessControl/SubmarineBack
MethodPUT
DescriptionSet the parameters of the cross-controller anti-​passing back server.
QueryNone.
RequestXML_SubmarineBack
ResponseXML_ResponseStatus
5.3.60 /ISAPI/AccessControl/SubmarineBack/capabilities
Get the configuration capability of the cross-controller anti-passing back server.
Intelligent Security API (Access Control on Person) Developer Guide
## 117

Request URI Definition
Table 5-121 GET /ISAPI/AccessControl/SubmarineBack/capabilities
MethodGET
DescriptionGet the configuration capability of the cross-controller anti-​passing
back server.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_SubmarineBack
Failed: XML_ResponseStatus
5.3.61 /ISAPI/AccessControl/SubmarineBackHostInfo/capabilities
Get the configuration capability of access controllers for cross-controller anti-passing back.
Request URI Definition
Table 5-122 GET /ISAPI/AccessControl/SubmarineBackHostInfo/capabilities
MethodGET
DescriptionGet the configuration capability of access controllers for cross-
controller anti-​passing back.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_SubmarineBackHostInfo
Failed: XML_ResponseStatus
5.3.62 /ISAPI/AccessControl/SubmarineBackHostInfo/ConfigureNo/<ID>
Operations about the configuration of access controllers for cross-controller anti-passing back.
Request URI Definition
Table 5-123 GET /ISAPI/AccessControl/SubmarineBackHostInfo/ConfigureNo/<ID>
MethodGET
DescriptionGet the parameters of access controllers for cross-controller anti-
passing back.
Intelligent Security API (Access Control on Person) Developer Guide
## 118

QueryNone.
RequestNone.
ResponseSucceeded: XML_SubmarineBackHostInfo
Failed: XML_ResponseStatus
Table 5-124 PUT /ISAPI/AccessControl/SubmarineBackHostInfo/ConfigureNo/<ID>
MethodPUT
DescriptionSet the parameters of access controllers for cross-controller anti-
passing back.
QueryNone.
RequestXML_SubmarineBackHostInfo
ResponseXML_ResponseStatus
## Remarks
The <ID> in the request URI refers to the configuration No., which is between 1 and 4. More
specifically, 1 refers to device No.1 to device No.16, 2refers to device No.17 to device No.32, 3
refers to device No.33 to device No.48, and 4 refers to device No.49 to device No.64.
5.3.63 /ISAPI/AccessControl/SubmarineBackMode
Operations about the configuration of cross-controller anti-passing back mode and rule.
Request URI Definition
Table 5-125 GET /ISAPI/AccessControl/SubmarineBackMode
MethodGET
DescriptionGet the parameters of cross-controller anti-​passing back mode and
rule.
QueryNone.
RequestNone.
ResponseSucceeded: XML_SubmarineBackMode
Failed: XML_ResponseStatus
Table 5-126 PUT /ISAPI/AccessControl/SubmarineBackMode
MethodPUT
DescriptionSet the parameters of cross-controller anti-​passing back mode and
rule.
Intelligent Security API (Access Control on Person) Developer Guide
## 119

QueryNone.
RequestXML_SubmarineBackMode
ResponseXML_ResponseStatus
5.3.64 /ISAPI/AccessControl/SubmarineBackMode/capabilities
Get the configuration capability of cross-controller anti-passing back mode and rule.
Request URI Definition
Table 5-127 GET /ISAPI/AccessControl/SubmarineBackMode/capabilities
MethodGET
DescriptionGet the configuration capability of cross-controller anti-​passing back
mode and rule.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_SubmarineBackMode
Failed: XML_ResponseStatus
5.3.65 /ISAPI/AccessControl/SubmarineBackReader/capabilities
Get the configuration capability of card readers for cross-controller anti-passing back.
Request URI Definition
Table 5-128 GET /ISAPI/AccessControl/SubmarineBackReader/capabilities
MethodGET
DescriptionGet the configuration capability of card readers for cross-controller
anti-​passing back.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_SubmarineBackReader
Failed: XML_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 120

5.3.66 /ISAPI/AccessControl/SubmarineBackReader/ConfigureNo/<ID>
Operations about the configuration of card readers for cross-controller anti-passing back.
Request URI Definition
Table 5-129 GET /ISAPI/AccessControl/SubmarineBackReader/ConfigureNo/<ID>
MethodGET
DescriptionGet the parameters of card readers for cross-controller anti-​passing
back.
QueryNone.
RequestNone.
ResponseSucceeded: XML_SubmarineBackReader
Failed: XML_ResponseStatus
Table 5-130 PUT /ISAPI/AccessControl/SubmarineBackReader/ConfigureNo/<ID>
MethodPUT
DescriptionSet the parameters of card readers for cross-controller anti-​passing
back.
QueryNone.
RequestXML_SubmarineBackReader
ResponseXML_ResponseStatus
## Remarks
The <ID> in the request URI refers to the configuration No., which is between 1 and 128.
## 5.3.67
/ISAPI/AccessControl/Verification/ttsText/capabilities?format=json
Get the text configuration capability of the audio prompt for the authentication results.
Request URI Definition
Table 5-131 GET /ISAPI/AccessControl/Verification/ttsText/capabilities?format=json
MethodGET
DescriptionGet the text configuration capability of the audio prompt for the
authentication results.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 121

RequestNone.
ResponseSucceeded: JSON_TTSTextCap
Failed: JSON_ResponseStatus
5.3.68 /ISAPI/AccessControl/Verification/ttsText?format=json
Get or set the text parameters of the audio prompt for the authentication results.
Request URI Definition
Table 5-132 GET /ISAPI/AccessControl/Verification/ttsText?format=json
MethodGET
DescriptionGet the text parameters of the audio prompt for the authentication
results.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_TTSText
Failed: JSON_ResponseStatus
Table 5-133 PUT /ISAPI/AccessControl/Verification/ttsText?format=json
MethodPUT
DescriptionSet the text parameters of the audio prompt for the authentication
results.
Queryformat: determine the format of request or response message.
RequestJSON_TTSText
ResponseJSON_ResponseStatus
## Remarks
The configured text will be converted to a audio prompt.
## 5.3.69
/ISAPI/AccessControl/WiegandCfg/capabilities
Get the Wiegand configuration capability.
Intelligent Security API (Access Control on Person) Developer Guide
## 122

Request URI Definition
Table 5-134 GET /ISAPI/AccessControl/WiegandCfg/capabilities
MethodGET
DescriptionGet the Wiegand configuration capability.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_WiegandCfg
Failed: XML_ResponseStatus
5.3.70 /ISAPI/AccessControl/WiegandCfg/wiegandNo/<ID>
Get or set Wiegand parameters.
Request URI Definition
Table 5-135 GET /ISAPI/AccessControl/WiegandCfg/wiegandNo/<ID>
MethodGET
DescriptionGet Wiegand parameters.
QueryNone.
RequestNone.
ResponseSucceeded: XML_WiegandCfg
Failed: XML_ResponseStatus
Table 5-136 PUT /ISAPI/AccessControl/WiegandCfg/wiegandNo/<ID>
MethodPUT
DescriptionSet Wiegand parameters.
QueryNone.
RequestXML_WiegandCfg
ResponseXML_ResponseStatus
5.3.71 /ISAPI/AccessControl/WiegandRuleCfg
Operations about the configuration of the custom Wiegand rule.
Intelligent Security API (Access Control on Person) Developer Guide
## 123

Request URI Definition
Table 5-137 GET /ISAPI/AccessControl/WiegandRuleCfg
MethodGET
DescriptionGet the configuration parameters of the custom Wiegand rule.
QueryNone.
RequestNone.
ResponseSucceeded: XML_WiegandRuleCfg
Failed: XML_ResponseStatus
Table 5-138 PUT /ISAPI/AccessControl/WiegandRuleCfg
MethodPUT
DescriptionSet the parameters of the custom Wiegand rule.
QueryNone.
RequestXML_WiegandRuleCfg
ResponseXML_ResponseStatus
5.3.72 /ISAPI/AccessControl/WiegandRuleCfg/capabilities
Get the configuration capability of the custom Wiegand rule.
Request URI Definition
Table 5-139 GET /ISAPI/AccessControl/WiegandRuleCfg/capabilities
MethodGET
DescriptionGet the configuration capability of the custom Wiegand rule.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_WiegandRuleCfg
Failed: XML_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 124

## 5.4 Other Resource Settings
5.4.1 /ISAPI/Intelligent/FDLib/capabilities?format=json
Get face picture library capability.
Request URI Definition
Table 5-140 GET /ISAPI/Intelligent/FDLib/capabilities?format=json
MethodGET
DescriptionGet face picture library capability.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_FPLibCap
Failed: JSON_ResponseStatus
5.4.2 /ISAPI/Intelligent/FDLib/Count?format=json
Get the total number of face records in all face picture libraries.
Request URI Definition
Table 5-141 GET /ISAPI/Intelligent/FDLib/Count?format=json
MethodGET
DescriptionGet the total number of face records in all face picture libraries.
Queryformat: determine the format of request or response message.
RequestNone
ResponseSucceeded: JSON_FaceRecordNumInAllFPLib
Failed: JSON_ResponseStatus
5.4.3 /ISAPI/Intelligent/FDLib/Count?format=json&FDID=&faceLibType=
Get the number of face records in a specific face picture library.
Intelligent Security API (Access Control on Person) Developer Guide
## 125

Request URI Definition
Table 5-142 GET /ISAPI/Intelligent/FDLib/Count?format=json&FDID=&faceLibType=
MethodGET
DescriptionGet the number of face records in a specific face picture library.
Queryformat: determine the format of request or response message.
FDID: face picture library ID.
faceLibType: face picture library type, which can equal to "blackFD"
(list library) and
"staticFD" (static library).
RequestNone
ResponseSucceeded: JSON_FaceRecordNumInOneFPLib
Failed: JSON_ResponseStatus
## Remarks
In the URI, to specify a face picture library, both the library ID (FDID) and library type (faceLibType)
are required, e.g., /ISAPI/Intelligent/FDLib/Count?
format=json&FDID=1223344455566788&faceLibType=blackFD.
5.4.4 /ISAPI/Intelligent/FDLib/FaceDataRecord?format=json
Add the face record (face picture and person information) to a face picture library or multiple face
picture libraries.
Request URI Definition
Table 5-143 POST /ISAPI/Intelligent/FDLib/FaceDataRecord?format=json
MethodPOST
DescriptionAdd a face record (including face picture and person information) to
the face picture library.
Queryformat: determine the format of request or response message.
RequestJSON_AddFaceRecordCond
ResponseSucceeded: JSON_AddFaceRecordResult
Failed: JSON_ResponseStatus
5.4.5 /ISAPI/Intelligent/FDLib/FDSearch/Delete?format=json&FDID=&faceLibType=
Delete the face record(s) in a specific face picture library.
Intelligent Security API (Access Control on Person) Developer Guide
## 126

Request URI Definition
Table 5-144 PUT /ISAPI/Intelligent/FDLib/FDSearch/Delete?format=json&FDID=&faceLibType=
MethodPUT
DescriptionDelete the face record(s) in the face picture library.
Queryformat: determine the format of request or response message.
FDID: face picture library ID
faceLibType: face picture library type
RequestJSON_DelFaceRecord
ResponseJSON_ResponseStatus
## Remarks
In the URI, to specify a face picture library, both the library ID (FDID) and library type (faceLibType)
are required.
5.4.6 /ISAPI/Intelligent/FDLib/FDSearch?format=json
Search for the face records in the face picture library.
Request URI Definition
Table 5-145 POST /ISAPI/Intelligent/FDLib/FDSearch?format=json
MethodPOST
DescriptionSearch for the face records in the a face picture library or multiple
face picture libraries. Fuzzy search is also supported.
Queryformat: determine the format of request or response message.
RequestJSON_SearchFaceRecordCond
ResponseSucceeded: JSON_SearchFaceRecordResult
Failed: JSON_ResponseStatus
5.4.7 /ISAPI/Intelligent/FDLib/FDSearch?format=json&FDID=&FPID=&faceLibType=
Edit a face record in a specific face picture library.
Intelligent Security API (Access Control on Person) Developer Guide
## 127

Request URI Definition
Table 5-146 PUT /ISAPI/Intelligent/FDLib/FDSearch?format=json&FDID=&FPID=&faceLibType=
MethodPUT
DescriptionEdit a face record in a specific face picture library.
Queryformat: determine the format of request or response message.
FDID: face picture library ID
FPID: face record ID
faceLibType: face picture library type, which can be "blackFD" (list
library) or "staticFD" (static library).
RequestJSON_EditFaceRecord
ResponseJSON_ResponseStatus
## Remarks
In the URI, to specify a face picture library, both the library ID (FDID) and library type (faceLibType)
are required.
5.4.8 /ISAPI/Intelligent/FDLib/FDSetUp?format=json
Set the face record (including face picture, person information, etc.) in the face picture library.
Request URI Definition
Table 5-147 PUT /ISAPI/Intelligent/FDLib/FDSetUp?format=json
MethodPUT
DescriptionSet the face record (including face picture, person information, etc.)
in the face picture library.
Queryformat: determine the format of request or response message.
RequestJSON_SetFaceRecord
ResponseJSON_ResponseStatus
## Remarks
•If the face picture with the employee No. (person ID) does not exist, the face record will be
added.
•If the face picture with the employee No. (person ID) exists, the face record will be
overwritten.
Intelligent Security API (Access Control on Person) Developer Guide
## 128

•When
deleting the face record, the faceLibType, FDID, FPID, and deleteFP in the request
message JSON_SetFaceRecord should be configured, and the success response message will be
returned no matter whether deleting succeeded or not.
•The employee No. is required.
5.4.9 /ISAPI/Intelligent/FDLib?format=json
Operations about the face picture library.
Request URI Definition
Table 5-148 POST /ISAPI/Intelligent/FDLib?format=json
MethodPOST
DescriptionCreate a face picture library
Queryformat: determine the format of request or response message.
RequestJSON_CreateFPLibCond
ResponseSucceeded: JSON_CreateFPLibResult
Failed: JSON_ResponseStatus
Table 5-149 GET /ISAPI/Intelligent/FDLib?format=json
MethodGET
DescriptionGet the information, including library ID, library type, name, and
custom information, of all face picture libraries.
Queryformat: determine the format of request or response message.
RequestNone
ResponseSucceeded: JSON_FPLibListInfo
Failed: JSON_ResponseStatus
Table 5-150 DELETE /ISAPI/Intelligent/FDLib?format=json
MethodDELETE
DescriptionDelete all face picture libraries.
Queryformat: determine the format of request or response message.
RequestNone
ResponseJSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 129

## Remarks
After a face picture library is created, the face picture library ID will be returned. Each face picture
library ID of the same library type is unique.
5.4.10 /ISAPI/Intelligent/FDLib?format=json&FDID=&faceLibType=
Operations about the management of a specific face picture library.
Request URI Definition
Table 5-151 GET /ISAPI/Intelligent/FDLib?format=json&FDID=&faceLibType=
MethodGET
DescriptionGet the information, including library ID, library type, name, and
custom information, of a specific face picture library.
Queryformat: determine the format of request or response message.
FDID: face picture library ID.
faceLibType: face picture library type.
RequestNone.
ResponseSucceeded: JSON_SingleFPLibInfo
Failed: JSON_ResponseStatus
Table 5-152 PUT /ISAPI/Intelligent/FDLib?format=json&FDID=&faceLibType=
MethodPUT
DescriptionEdit the information of a specific face picture library information,
including name and custom information.
Queryformat: determine the format of request or response message.
FDID: face picture library ID
faceLibType: face picture library type
RequestJSON_EditFPlibInfo
ResponseJSON_ResponseStatus
Table 5-153 DELETE /ISAPI/Intelligent/FDLib?format=json&FDID=&faceLibType=
MethodDELETE
DescriptionDelete a specific face picture library.
Queryformat: determine the format of request or response message.
FDID: face picture library ID
Intelligent Security API (Access Control on Person) Developer Guide
## 130

faceLibType: face picture library type
RequestNone.
ResponseJSON_ResponseStatus
## Remarks
In the URI, to specify a face picture library, both the library ID (FDID) and library type (faceLibType)
are required.
5.4.11 /ISAPI/SecurityCP/AlarmInCfg/<ID>?format=json
Operations about the alarm input configuration.
Request URI Definition
Table 5-154 GET /ISAPI/SecurityCP/AlarmInCfg/<ID>?format=json
MethodGET
DescriptionGet the alarm input configuration parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_AlarmInCfg
Failed: JSON_ResponseStatus
Table 5-155 PUT /ISAPI/SecurityCP/AlarmInCfg/<ID>?format=json
MethodPUT
DescriptionSet the alarm input parameters.
Queryformat: determine the format of request or response message.
RequestJSON_AlarmInCfg
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the alarm input No. which starts from 0.
## 5.4.12
/ISAPI/SecurityCP/AlarmInCfg/capabilities?format=json
Get the configuration capability of the alarm inputs.
Intelligent Security API (Access Control on Person) Developer Guide
## 131

Request URI Definition
Table 5-156 GET /ISAPI/SecurityCP/AlarmInCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the alarm inputs.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AlarmInCfg
Failed: JSON_ResponseStatus
5.4.13 /ISAPI/SecurityCP/AlarmOutCfg/<ID>?format=json
Operations about the configuration of a specific alarm output.
Request URI Definition
Table 5-157 GET /ISAPI/SecurityCP/AlarmOutCfg/<ID>?format=json
MethodGET
DescriptionGet the parameters of a specific alarm output.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_AlarmOutCfg
Failed: JSON_ResponseStatus
Table 5-158 PUT /ISAPI/SecurityCP/AlarmOutCfg/<ID>?format=json
MethodPUT
DescriptionSet the parameters of a specific alarm output.
Queryformat: determine the format of request or response message.
RequestJSON_AlarmOutCfg
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the alarm output No. which starts from 0.
Intelligent Security API (Access Control on Person) Developer Guide
## 132

5.4.14 /ISAPI/SecurityCP/AlarmOutCfg/capabilities?format=json
Get the configuration capability of the alarm outputs.
Request URI Definition
Table 5-159 GET /ISAPI/SecurityCP/AlarmOutCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the alarm outputs.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AlarmOutCfg
Failed: JSON_ResponseStatus
5.4.15 /ISAPI/SecurityCP/AlarmOutCfg?format=json
Get or set configuration parameters of multiple alarm outputs in a batch.
Request URI Definition
Table 5-160 GET /ISAPI/SecurityCP/AlarmOutCfg?format=json
MethodGET
DescriptionGet configuration parameters of multiple alarm outputs in a batch.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_AlarmOutCfgList
Failed: JSON_ResponseStatus
Table 5-161 PUT /ISAPI/SecurityCP/AlarmOutCfg?format=json
MethodPUT
DescriptionSet configuration parameters of multiple alarm outputs in a batch.
Queryformat: determine the format of request or response message.
RequestJSON_AlarmOutCfgList
ResponseJSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 133

5.4.16 /ISAPI/SecurityCP/Configuration/capabilities?format=json
Get the configuration capability of security control panel.
Request URI Definition
Table 5-162 GET /ISAPI/SecurityCP/Configuration/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of security control panel.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_HostConfigCap
Failed: JSON_ResponseStatus
5.4.17 /ISAPI/SecurityCP/ControlAlarmChan?format=json
Arm or disarm the alarm input port (zone).
Request URI Definition
Table 5-163 PUT /ISAPI/SecurityCP/ControlAlarmChan?format=json
MethodPUT
DescriptionArm or disarm the alarm input port (zone).
Queryformat: determine the format of request or response message.
RequestJSON_ControlAlarmChan
ResponseJSON_ResponseStatus
5.4.18 /ISAPI/SecurityCP/ControlAlarmChan/capabilities?format=json
Get the capability of arming or disarming the alarm input port (zone).
Request URI Definition
Table 5-164 GET /ISAPI/SecurityCP/ControlAlarmChan/capabilities?format=json
MethodGET
DescriptionGet the capability of arming or disarming the alarm input port (zone).
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 134

RequestNone.
ResponseSucceeded: JSON_Cap_ControlAlarmChan
Failed: JSON_ResponseStatus
5.4.19 /ISAPI/SecurityCP/SetAlarmHostOut/capabilities?format=json
Get the capability of setting the alarm output.
Request URI Definition
Table 5-165 GET /ISAPI/SecurityCP/SetAlarmHostOut/capabilities?format=json
MethodGET
DescriptionGet the capability of setting the alarm output.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_SetAlarmHostOut
Failed: JSON_ResponseStatus
5.4.20 /ISAPI/SecurityCP/SetAlarmHostOut?format=json
Set the alarm output.
Request URI Definition
Table 5-166 PUT /ISAPI/SecurityCP/SetAlarmHostOut?format=json
MethodPUT
DescriptionSet the alarm output.
Queryformat: determine the format of request or response message.
RequestJSON_SetAlarmHostOut
ResponseJSON_ResponseStatus
5.4.21 /ISAPI/System/PictureServer/capabilities?format=json
Get the picture storage server capability.
Intelligent Security API (Access Control on Person) Developer Guide
## 135

Request URI Definition
Table 5-167 GET /ISAPI/System/PictureServer/capabilities?format=json
MethodGET
DescriptionGet the picture storage server capability.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_PictureServerInformation
Failed: JSON_ResponseStatus
5.4.22 /ISAPI/System/PictureServer?format=json
Operations about the picture storage server configuration parameters.
Request URI Definition
Table 5-168 GET /ISAPI/System/PictureServer?format=json
MethodGET
DescriptionGet the picture storage server parameters.
Queryformat: determine the format of request or response message.
security: the version No. of encryption scheme. When security does
not exist, it indicates that the data is not encrypted; when security is
1, it indicates that the nodes of
sensitive information in the message
are encrypted in AES128 CBC mode; when security is 2, it indicates
that the nodes of sensitive information in the message are encrypted
in AES256 CBC mode.
iv: the initialization vector, and it is required when security is 1 or 2.
RequestNone.
ResponseSucceeded: JSON_PictureServerInformation
Failed: JSON_ResponseStatus
Table 5-169 PUT /ISAPI/System/PictureServer?format=json
MethodPUT
DescriptionSet the picture storage server parameters.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 136

security: the version No. of encryption scheme. When security does
not exist, it indicates that the data is not encrypted; when security is
1, it indicates that the nodes of sensitive information in the message
are encrypted in AES128 CBC mode; when security is 2, it indicates
that the nodes of sensitive information in the message are encrypted
in AES256 CBC mode.
iv: the
initialization vector, and it is required when security is 1 or 2.
RequestJSON_PictureServerInformation
ResponseJSON_ResponseStatus
## 5.5 Schedule Settings
5.5.1 /ISAPI/AccessControl/CardReaderPlan/<CardReaderNo>?format=json
Operations about the control schedule configuration of the card reader authentication mode.
Request URI Definition
Table 5-170 GET /ISAPI/AccessControl/CardReaderPlan/<CardReaderNo>?format=json
MethodGET
DescriptionGet the control schedule configuration parameters of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_CardReaderPlan
Failed: JSON_ResponseStatus
Table 5-171 PUT /ISAPI/AccessControl/CardReaderPlan/<CardReaderNo>?format=json
MethodPUT
DescriptionSet the control schedule parameters of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
RequestJSON_CardReaderPlan
ResponseJSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 137

## Remarks
The <CardReaderNo> in the request URI refers to the card reader No. which starts from 1, and you
can get the maximum number of the card readers supported by the device from the control
schedule configuration capability of the card reader authentication mode
( JSON_Cap_CardReaderPlan ).
5.5.2 /ISAPI/AccessControl/CardReaderPlan/capabilities?format=json
Get the control schedule configuration capability of the card reader authentication mode.
Request URI Definition
Table 5-172 GET /ISAPI/AccessControl/CardReaderPlan/capabilities?format=json
MethodGET
DescriptionGet the control schedule configuration capability of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_CardReaderPlan
Failed: JSON_ResponseStatus
5.5.3 /ISAPI/AccessControl/UserRightHolidayPlanCfg/capabilities?format=json
Get the holiday schedule configuration capability of the access permission control.
Request URI Definition
Table 5-173 GET /ISAPI/AccessControl/UserRightHolidayPlanCfg/capabilities?format=json
MethodGET
DescriptionGet the holiday schedule configuration capability of the access
permission control.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_UserRightHolidayPlanCfg
Failed: JSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 138

5.5.4 /ISAPI/AccessControl/UserRightWeekPlanCfg/capabilities?format=json
Get the week schedule configuration capability of the access permission control.
Request URI Definition
Table 5-174 GET /ISAPI/AccessControl/UserRightWeekPlanCfg/capabilities?format=json
MethodGET
DescriptionGet the week schedule configuration capability of the access
permission control.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_UserRightWeekPlanCfg
Failed: JSON_ResponseStatus
5.5.5 /ISAPI/AccessControl/ClearPlansCfg/capabilities?format=json
Get the capability of clearing access control schedule configuration.
Request URI Definition
Table 5-175 GET /ISAPI/AccessControl/ClearPlansCfg/capabilities?format=json
MethodGET
DescriptionGet the capability of clearing access control schedule
configuration.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_ClearPlansCfg
Failed: JSON_ResponseStatus
5.5.6 /ISAPI/AccessControl/ClearPlansCfg?format=json
Clear the access control schedule configuration.
Intelligent Security API (Access Control on Person) Developer Guide
## 139

Request URI Definition
Table 5-176 PUT /ISAPI/AccessControl/ClearPlansCfg?format=json
MethodPUT
DescriptionClear the access control schedule configuration parameters.
Queryformat: determine the format of request or response message.
RequestJSON_ClearPlansCfg
ResponseJSON_ResponseStatus
5.5.7 /ISAPI/AccessControl/DoorStatusHolidayGroupCfg/<GroupNo>?format=json
Operations about the holiday group configuration of the door control schedule.
Request URI Definition
Table 5-177 GET /ISAPI/AccessControl/DoorStatusHolidayGroupCfg/<GroupNo>?format=json
MethodGET
DescriptionGet the holiday group configuration parameters of the door control
schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_DoorStatusHolidayGroupCfg
Failed: JSON_ResponseStatus
Table 5-178 PUT /ISAPI/AccessControl/DoorStatusHolidayGroupCfg/<GroupNo>?format=json
MethodPUT
DescriptionSet the holiday group parameters of the door control schedule.
Queryformat: determine the format of request or response message.
RequestJSON_DoorStatusHolidayGroupCfg
ResponseJSON_ResponseStatus
## Remarks
The <GroupNo> in the request URI refers to the holiday group No. which starts from 1, and you can
get the maximum number of the holiday groups supported by the device from the holiday group
configuration capability of the door control schedule ( JSON_Cap_DoorStatusHolidayGroupCfg ).
Intelligent Security API (Access Control on Person) Developer Guide
## 140

5.5.8 /ISAPI/AccessControl/DoorStatusHolidayGroupCfg/capabilities?format=json
Get the holiday group configuration capability of the door control schedule.
Request URI Definition
Table 5-179 GET /ISAPI/AccessControl/DoorStatusHolidayGroupCfg/capabilities?format=json
MethodGET
DescriptionGet the holiday group configuration capability of the door control
schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_DoorStatusHolidayGroupCfg
Failed: JSON_ResponseStatus
5.5.9 /ISAPI/AccessControl/DoorStatusHolidayPlanCfg/<PlanNo>?format=json
Operations about the configuration of the door control holiday schedule.
Request URI Definition
Table 5-180 GET /ISAPI/AccessControl/DoorStatusHolidayPlanCfg/<PlanNo>?format=json
MethodGET
DescriptionGet the configuration parameters of the door control holiday
schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_DoorStatusHolidayPlanCfg
Failed: JSON_ResponseStatus
Table 5-181 PUT /ISAPI/AccessControl/DoorStatusHolidayPlanCfg/<PlanNo>?format=json
MethodPUT
DescriptionSet the parameters of the door control holiday schedule.
Queryformat: determine the format of request or response message.
RequestJSON_DoorStatusHolidayPlanCfg
ResponseJSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 141

## Remarks
The <PlanNo> in the request URI refers to the holiday schedule No. which starts from 1, and you
can get the maximum number of the holiday schedules supported by the device from the
configuration capability of the door control holiday schedule
( JSON_Cap_DoorStatusHolidayPlanCfg ).
5.5.10 /ISAPI/AccessControl/DoorStatusHolidayPlanCfg/capabilities?format=json
Get the configuration capability of the door control holiday schedule.
Request URI Definition
Table 5-182 GET /ISAPI/AccessControl/DoorStatusHolidayPlanCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the door control holiday
schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_DoorStatusHolidayPlanCfg
Failed: JSON_ResponseStatus
5.5.11 /ISAPI/AccessControl/DoorStatusPlan/<DoorNo>?format=json
Operations about the configuration of the door control schedule.
Request URI Definition
Table 5-183 GET /ISAPI/AccessControl/DoorStatusPlan/<DoorNo>?format=json
MethodGET
DescriptionGet the configuration parameters of the door control schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_DoorStatusPlan
Failed: JSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 142

Table 5-184 PUT /ISAPI/AccessControl/DoorStatusPlan/<DoorNo>?format=json
MethodPUT
DescriptionSet the parameters of the door control schedule.
Queryformat: determine the format of request or response message.
RequestJSON_DoorStatusPlan
ResponseJSON_ResponseStatus
## Remarks
The <DoorNo> in the request URI refers to door No. which starts from 1, and you can get the
maximum number of the doors supported by the device from the configuration capability of the
door control schedule ( JSON_Cap_DoorStatusPlan ).
## 5.5.12
/ISAPI/AccessControl/DoorStatusPlan/capabilities?format=json
Get the configuration capability of the door control schedule.
Request URI Definition
Table 5-185 GET /ISAPI/AccessControl/DoorStatusPlan/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the door control schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_DoorStatusPlan
Failed: JSON_ResponseStatus
5.5.13 /ISAPI/AccessControl/DoorStatusPlanTemplate/<TemplateNo>?format=json
Operations about the configuration of the door control schedule template.
Request URI Definition
Table 5-186 GET /ISAPI/AccessControl/DoorStatusPlanTemplate/<TemplateNo>?format=json
MethodGET
DescriptionGet the configuration parameters of the door control schedule
template.
Intelligent Security API (Access Control on Person) Developer Guide
## 143

Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_DoorStatusPlanTemplate
Failed: JSON_ResponseStatus
Table 5-187 PUT /ISAPI/AccessControl/DoorStatusPlanTemplate/<TemplateNo>?format=json
MethodPUT
DescriptionSet the parameters of the door control schedule template.
Queryformat: determine the format of request or response message.
RequestJSON_DoorStatusPlanTemplate
ResponseJSON_ResponseStatus
## Remarks
The <TemplateNo> in the request URI refers to door control schedule template No. which starts
from 1, and you can get the maximum number of the templates supported by the device from the
configuration capability of the door control schedule template
( JSON_Cap_DoorStatusPlanTemplate ).
## 5.5.14
/ISAPI/AccessControl/DoorStatusPlanTemplate/capabilities?format=json
Get the configuration capability of the door control schedule template.
Request URI Definition
Table 5-188 GET /ISAPI/AccessControl/DoorStatusPlanTemplate/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the door control schedule
template.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_DoorStatusPlanTemplate
Failed: JSON_ResponseStatus
5.5.15 /ISAPI/AccessControl/DoorStatusWeekPlanCfg/<PlanNo>?format=json
Operations about the configuration of the door control week schedule.
Intelligent Security API (Access Control on Person) Developer Guide
## 144

Request URI Definition
Table 5-189 GET /ISAPI/AccessControl/DoorStatusWeekPlanCfg/<PlanNo>?format=json
MethodGET
DescriptionGet the configuration parameters of the door control week
schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_DoorStatusWeekPlanCfg
Failed: JSON_ResponseStatus
Table 5-190 PUT /ISAPI/AccessControl/DoorStatusWeekPlanCfg/<PlanNo>?format=json
MethodPUT
DescriptionSet the parameters of the door control week schedule.
Queryformat: determine the format of request or response message.
RequestJSON_DoorStatusWeekPlanCfg
ResponseJSON_ResponseStatus
## Remarks
The <PlanNo> in the request URI refers to the door control week schedule No. which starts from 1,
and you can get the maximum number of week schedules supported by the device from the
configuration capability of the door control week schedule ( JSON_Cap_DoorStatusWeekPlanCfg ).
## 5.5.16
/ISAPI/AccessControl/DoorStatusWeekPlanCfg/capabilities?format=json
Get the configuration capability of the door control week schedule.
Request URI Definition
Table 5-191 GET /ISAPI/AccessControl/DoorStatusWeekPlanCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the door control week
schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_DoorStatusWeekPlanCfg
Intelligent Security API (Access Control on Person) Developer Guide
## 145

Failed: JSON_ResponseStatus
5.5.17 /ISAPI/AccessControl/UserRightHolidayGroupCfg/<GroupNo>?format=json
Operations about the holiday group configuration of the access permission control schedule.
Request URI Definition
Table 5-192 GET /ISAPI/AccessControl/UserRightHolidayGroupCfg/<GroupNo>?format=json
MethodGET
DescriptionGet the holiday group configuration parameters of the access
permission control schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_UserRightHolidayGroupCfg
Failed: JSON_ResponseStatus
Table 5-193 PUT /ISAPI/AccessControl/UserRightHolidayGroupCfg/<GroupNo>?format=json
MethodPUT
DescriptionSet the holiday group parameters of the access permission control
schedule.
Queryformat: determine the format of request or response message.
RequestJSON_UserRightHolidayGroupCfg
ResponseJSON_ResponseStatus
## Remarks
The <GroupNo> in the request URI refers to the holiday group No. which starts from 1, and you can
get the maximum number of the holiday groups supported by the device from the holiday group
configuration capability of the access permission control schedule
( JSON_Cap_UserRightHolidayGroupCfg ).
## 5.5.18
/ISAPI/AccessControl/UserRightHolidayGroupCfg/capabilities?format=json
Get the holiday group configuration capability of the access permission control schedule.
Intelligent Security API (Access Control on Person) Developer Guide
## 146

Request URI Definition
Table 5-194 GET /ISAPI/AccessControl/UserRightHolidayGroupCfg/capabilities?format=json
MethodGET
DescriptionGet the holiday group configuration capability of the access
permission control schedule.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_UserRightHolidayGroupCfg
Failed: JSON_ResponseStatus
5.5.19 /ISAPI/AccessControl/UserRightHolidayPlanCfg/<PlanNo>?format=json
Operations about the holiday schedule configuration of the access permission control.
Request URI Definition
Table 5-195 GET /ISAPI/AccessControl/UserRightHolidayPlanCfg/<PlanNo>?format=json
MethodGET
DescriptionGet the holiday schedule configuration parameters of the access
permission control.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_UserRightHolidayPlanCfg
Failed: JSON_ResponseStatus
Table 5-196 PUT /ISAPI/AccessControl/UserRightHolidayPlanCfg/<PlanNo>?format=json
MethodPUT
DescriptionSet the holiday schedule parameters of the access permission control.
Queryformat: determine the format of request or response message.
RequestJSON_UserRightHolidayPlanCfg
ResponseJSON_ResponseStatus
## Remarks
The <PlanNo> in the request URI refers to the holiday schedule No. which starts from 1, and you
can get the maximum number of the holiday schedules supported by the device from the holiday
Intelligent Security API (Access Control on Person) Developer Guide
## 147

schedule configuration capability of the access permission control
( JSON_Cap_UserRightHolidayPlanCfg ).
5.5.20 /ISAPI/AccessControl/UserRightPlanTemplate/<TemplateNo>?format=json
Operations about the schedule template configuration of the access permission control.
Request URI Definition
Table 5-197 GET /ISAPI/AccessControl/UserRightPlanTemplate/<TemplateNo>?format=json
MethodGET
DescriptionGet the schedule template configuration parameters of the access
permission control.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_UserRightPlanTemplate
Failed: JSON_ResponseStatus
Table 5-198 PUT /ISAPI/AccessControl/UserRightPlanTemplate/<TemplateNo>?format=json
MethodPUT
DescriptionSet the schedule template parameters of the access permission
control.
Queryformat: determine the format of request or response message.
RequestJSON_UserRightPlanTemplate
ResponseJSON_ResponseStatus
## Remarks
The <TemplateNo> in the request URI refers to the schedule template No. which starts from 1, and
you can get the maximum number of the templates supported by the device from the schedule
template
configuration capability of the access permission control
( JSON_Cap_UserRightPlanTemplate ).
## 5.5.21
/ISAPI/AccessControl/UserRightPlanTemplate/capabilities?format=json
Get the schedule template configuration capability of the access permission control.
Intelligent Security API (Access Control on Person) Developer Guide
## 148

Request URI Definition
Table 5-199 GET /ISAPI/AccessControl/UserRightPlanTemplate/capabilities?format=json
MethodGET
DescriptionGet the schedule template configuration capability of the access
permission control.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_UserRightPlanTemplate
Failed: JSON_ResponseStatus
5.5.22 /ISAPI/AccessControl/UserRightWeekPlanCfg/<PlanNo>?format=json
Operations about the week schedule configuration of the access permission control.
Request URI Definition
Table 5-200 GET /ISAPI/AccessControl/UserRightWeekPlanCfg/<PlanNo>?format=json
MethodGET
DescriptionGet the week schedule configuration parameters of the access
permission control.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_UserRightWeekPlanCfg
Failed: JSON_ResponseStatus
Table 5-201 PUT /ISAPI/AccessControl/UserRightWeekPlanCfg/<PlanNo>?format=json
MethodPUT
DescriptionSet the week schedule parameters of the access permission control.
Queryformat: determine the format of request or response message.
RequestJSON_UserRightWeekPlanCfg
ResponseJSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 149

## Remarks
The <PlanNo> in the request URI refers to the week schedule No. which starts from 1, and you can
get the maximum number of the week schedules supported by the device from the week schedule
configuration capability of the access permission control ( JSON_Cap_UserRightWeekPlanCfg ).
5.5.23 /ISAPI/AccessControl/VerifyHolidayGroupCfg/<GroupNo>?format=json
Operations about the holiday group configuration of the control schedule of the card reader
authentication mode.
Request URI Definition
Table 5-202 GET /ISAPI/AccessControl/VerifyHolidayGroupCfg/<GroupNo>?format=json
MethodGET
DescriptionGet the holiday group configuration parameters of the control schedule
of the card reader authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_VerifyHolidayGroupCfg
Failed: JSON_ResponseStatus
Table 5-203 PUT /ISAPI/AccessControl/VerifyHolidayGroupCfg/<GroupNo>?format=json
MethodPUT
DescriptionSet the holiday group parameters of the control schedule of the card
reader authentication mode.
Queryformat: determine the format of request or response message.
RequestJSON_VerifyHolidayGroupCfg
ResponseJSON_ResponseStatus
## Remarks
The <GroupNo> in the request URI refers to the holiday group No. which starts from 1, and you can
get the maximum number of the holiday groups supported by the device from the holiday group
configuration capability of the control schedule of the card reader authentication mode
( JSON_Cap_VerifyHolidayGroupCfg ).
Intelligent Security API (Access Control on Person) Developer Guide
## 150

5.5.24 /ISAPI/AccessControl/VerifyHolidayGroupCfg/capabilities?format=json
Get the holiday group configuration capability of the control schedule of the card reader
authentication mode.
Request URI Definition
Table 5-204 GET /ISAPI/AccessControl/VerifyHolidayGroupCfg/capabilities?format=json
MethodGET
DescriptionGet the holiday group configuration capability of the control schedule
of the card reader authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_VerifyHolidayGroupCfg
Failed: JSON_ResponseStatus
5.5.25 /ISAPI/AccessControl/VerifyHolidayPlanCfg/<PlanNo>?format=json
Operations about the holiday schedule configuration of the card reader authentication mode.
Request URI Definition
Table 5-205 GET /ISAPI/AccessControl/VerifyHolidayPlanCfg/<PlanNo>?format=json
MethodGET
DescriptionGet the holiday schedule configuration parameters of the card
reader authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_VerifyHolidayPlanCfg
Failed: JSON_ResponseStatus
Table 5-206 PUT /ISAPI/AccessControl/VerifyHolidayPlanCfg/<PlanNo>?format=json
MethodPUT
DescriptionSet the holiday schedule parameters of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 151

RequestJSON_VerifyHolidayPlanCfg
ResponseJSON_ResponseStatus
## Remarks
The <PlanNo> in the request URI refers to the holiday schedule No. which starts from 1, and you
can get the maximum number of the holiday schedules supported by the device from the holiday
schedule
configuration capability of the card reader authentication mode
( JSON_Cap_VerifyHolidayPlanCfg ).
5.5.26 /ISAPI/AccessControl/VerifyHolidayPlanCfg/capabilities?format=json
Get the holiday schedule configuration capability of the card reader authentication mode.
Request URI Definition
Table 5-207 GET /ISAPI/AccessControl/VerifyHolidayPlanCfg/capabilities?format=json
MethodGET
DescriptionGet the holiday schedule configuration capability of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_VerifyHolidayPlanCfg
Failed: JSON_ResponseStatus
5.5.27 /ISAPI/AccessControl/VerifyPlanTemplate/<TemplateNo>?format=json
Operations about the schedule template configuration of the card reader authentication mode.
Request URI Definition
Table 5-208 GET /ISAPI/AccessControl/VerifyPlanTemplate/<TemplateNo>?format=json
MethodGET
DescriptionGet the schedule template configuration parameters of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_VerifyPlanTemplate
Intelligent Security API (Access Control on Person) Developer Guide
## 152

Failed: JSON_ResponseStatus
Table 5-209 PUT /ISAPI/AccessControl/VerifyPlanTemplate/<TemplateNo>?format=json
MethodPUT
DescriptionSet the schedule template parameters of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
RequestJSON_VerifyPlanTemplate
ResponseJSON_ResponseStatus
## Remarks
The <TemplateNo> in the request URI refers to the schedule template No. which starts from 1, and
you can get the maximum number of the templates supported by the device from the schedule
template
configuration capability of the card reader authentication mode
( JSON_Cap_VerifyPlanTemplate ).
## 5.5.28
/ISAPI/AccessControl/VerifyPlanTemplate/capabilities?format=json
Get the schedule template configuration capability of the card reader authentication mode.
Request URI Definition
Table 5-210 GET /ISAPI/AccessControl/VerifyPlanTemplate/capabilities?format=json
MethodGET
DescriptionGet the schedule template configuration capability of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_VerifyPlanTemplate
Failed: JSON_ResponseStatus
5.5.29 /ISAPI/AccessControl/VerifyWeekPlanCfg/<PlanNo>?format=json
Operations about the week schedule configuration of the card reader authentication mode.
Intelligent Security API (Access Control on Person) Developer Guide
## 153

Request URI Definition
Table 5-211 GET /ISAPI/AccessControl/VerifyPlanTemplate/capabilities?format=json
MethodGET
DescriptionGet the week schedule configuration parameters of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_VerifyWeekPlanCfg
Failed: JSON_ResponseStatus
Table 5-212 PUT /ISAPI/AccessControl/VerifyPlanTemplate/capabilities?format=json
MethodPUT
DescriptionSet the week schedule parameters of the card reader authentication
mode.
Queryformat: determine the format of request or response message.
RequestJSON_VerifyWeekPlanCfg
ResponseJSON_ResponseStatus
## Remarks
The <PlanNo> in the request URI refers to the week schedule No. which starts from 1, and you can
get the maximum number of the week schedules supported by the device from the week schedule
configuration capability of the card reader authentication mode ( JSON_Cap_VerifyWeekPlanCfg ).
## 5.5.30
/ISAPI/AccessControl/VerifyWeekPlanCfg/capabilities?format=json
Get the week schedule configuration capability of the card reader authentication mode.
Request URI Definition
Table 5-213 GET /ISAPI/AccessControl/VerifyWeekPlanCfg/capabilities?format=json
MethodGET
DescriptionGet the week schedule configuration capability of the card reader
authentication mode.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 154

RequestNone.
ResponseSucceeded: JSON_Cap_VerifyWeekPlanCfg
Failed: JSON_ResponseStatus
## 5.6 Remote Control
5.6.1 /ISAPI/AccessControl/RemoteControl/buzzer/<ID>?format=json
Remotely control the buzzer of the card reader.
Request URI Definition
Table 5-214 PUT /ISAPI/AccessControl/RemoteControl/buzzer/<ID>?format=json
MethodPUT
DescriptionRemotely control the buzzer of the card reader.
Queryformat: determine the format of request or response message.
RequestJSON_RemoteControlBuzzer
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the buzzer No., which is also the No. of the card reader. If the
<ID> is 65535, it refers to all buzzers (card readers).
## 5.6.2
/ISAPI/AccessControl/RemoteControl/buzzer/capabilities?format=json
Get the capability of remotely controlling the buzzer of the card reader.
Request URI Definition
Table 5-215 GET /ISAPI/AccessControl/RemoteControl/buzzer/capabilities?format=json
MethodGET
DescriptionGet the capability of remotely controlling the buzzer of the card
reader.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_RemoteControlBuzzer
Intelligent Security API (Access Control on Person) Developer Guide
## 155

Failed: JSON_ResponseStatus
5.6.3 /ISAPI/AccessControl/RemoteControl/door/<ID>
Remotely control the door or elevator.
Request URI Definition
Table 5-216 PUT /ISAPI/AccessControl/RemoteControl/door/<ID>
MethodPUT
DescriptionRemotely control the door or elevator.
QueryNone.
RequestXML_RemoteControlDoor
ResponseXML_ResponseStatus
## Remarks
The <ID> in the request URI refers to the door No. If the <ID> is 65535, it refers to all doors.
## 5.6.4
/ISAPI/AccessControl/RemoteControl/door/capabilities
Get the capability of remotely controlling the door or elevator.
Request URI Definition
Table 5-217 GET /ISAPI/AccessControl/RemoteControl/door/capabilities
MethodGET
DescriptionGet the capability of remotely controlling the door or elevator.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_RemoteControlDoor
Failed: XML_ResponseStatus
5.6.5 /ISAPI/AccessControl/remoteControlPWCheck/capabilities?format=json
Get the capability of verifying the password for remote door control.
Intelligent Security API (Access Control on Person) Developer Guide
## 156

Request URI Definition
Table 5-218 GET /ISAPI/AccessControl/remoteControlPWCheck/capabilities?format=json
MethodGET
DescriptionGet the capability of verifying the password for remote door control.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_RemoteControlPWCheck
Failed: JSON_ResponseStatus
5.6.6 /ISAPI/AccessControl/remoteControlPWCheck/door/<ID>?format=json
Verify the password for remote door control.
Request URI Definition
Table 5-219 PUT /ISAPI/AccessControl/remoteControlPWCheck/door/<ID>?format=json
MethodPUT
DescriptionVerify the password for remote door control.
Queryformat: determine the format of request or response message.
RequestJSON_RemoteControlPWCheck
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the door No.
## 5.7
Operation and Maintenance
5.7.1 /ISAPI/AccessControl/AcsWorkStatus/capabilities?format=json
Get the capability of getting the working status of the access controller.
Intelligent Security API (Access Control on Person) Developer Guide
## 157

Request URI Definition
Table 5-220 GET /ISAPI/AccessControl/AcsWorkStatus/capabilities?format=json
MethodGET
DescriptionGet the capability of getting the working status of the access
controller.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AcsWorkStatus
Failed: JSON_ResponseStatus
5.7.2 /ISAPI/AccessControl/AcsWorkStatus?format=json
Get the working status of the access controller.
Request URI Definition
Table 5-221 GET /ISAPI/AccessControl/AcsWorkStatus?format=json
MethodGET
DescriptionGet the working status of the access controller.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_AcsWorkStatus
Failed: JSON_ResponseStatus
5.7.3 /ISAPI/AccessControl/ClearAntiSneak/capabilities?format=json
Get the capability of clearing anti-passing back records.
Request URI Definition
Table 5-222 GET /ISAPI/AccessControl/ClearAntiSneak/capabilities?format=json
MethodGET
DescriptionGet the capability of clearing anti-​passing back records.
Queryformat: determine the format of request or response message.
Intelligent Security API (Access Control on Person) Developer Guide
## 158

RequestNone.
ResponseSucceeded: JSON_Cap_ClearAntiSneak
Failed: JSON_ResponseStatus
5.7.4 /ISAPI/AccessControl/ClearAntiSneak?format=json
Clear anti-passing back records.
Request URI Definition
Table 5-223 PUT /ISAPI/AccessControl/ClearAntiSneak?format=json
MethodPUT
DescriptionClear anti-​passing back records.
Queryformat: determine the format of request or response message.
RequestJSON_ClearAntiSneak
ResponseJSON_ResponseStatus
5.7.5 /ISAPI/AccessControl/ClearCardRecord
Clear card swiping records in the cross-controller anti-passing back server.
Request URI Definition
Table 5-224 PUT /ISAPI/AccessControl/ClearCardRecord
MethodPUT
DescriptionClear card swiping records in the cross-controller anti-​passing back
server.
QueryNone.
RequestXML_ClearCardRecord
ResponseXML_ResponseStatus
## Remarks
This request URI can only be used by the cross-controller anti-passing back server, and it is not
supported by the cross-controller
anti-passing back devices based on card mode.
Intelligent Security API (Access Control on Person) Developer Guide
## 159

5.7.6 /ISAPI/AccessControl/ClearCardRecord/capabilities
Get the capability of clearing card swiping records in the cross-controller anti-passing back server.
Request URI Definition
Table 5-225 GET /ISAPI/AccessControl/ClearCardRecord/capabilities
MethodGET
DescriptionGet the capability of clearing card swiping records in the cross-
controller anti-​passing back server.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_ClearCardRecord
Failed: XML_ResponseStatus
5.7.7 /ISAPI/AccessControl/ClearSubmarineBack
Clear cross-controller anti-passing back parameters.
Request URI Definition
Table 5-226 PUT /ISAPI/AccessControl/ClearSubmarineBack
MethodPUT
DescriptionClear cross-controller anti-​passing back parameters.
QueryNone.
RequestXML_ClearSubmarineBack
ResponseXML_ResponseStatus
5.7.8 /ISAPI/AccessControl/ClearSubmarineBack/capabilities
Get the capability of clearing cross-controller anti-passing back parameters.
Intelligent Security API (Access Control on Person) Developer Guide
## 160

Request URI Definition
Table 5-227 GET /ISAPI/AccessControl/ClearSubmarineBack/capabilities
MethodGET
DescriptionGet the capability of clearing cross-controller anti-​passing back
parameters.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_ClearSubmarineBack
Failed: XML_ResponseStatus
5.7.9 /ISAPI/AccessControl/DoorSecurityModule/moduleStatus
Get the status of the secure door control unit.
Request URI Definition
Table 5-228 GET /ISAPI/AccessControl/DoorSecurityModule/moduleStatus
MethodGET
DescriptionGet the status of the secure door control unit.
QueryNone.
RequestNone.
ResponseSucceeded: XML_ModuleStatus
Failed: XML_ResponseStatus
5.7.10 /ISAPI/AccessControl/DoorSecurityModule/moduleStatus/capabilities
Get the capability of getting the status of the secure door control unit.
Request URI Definition
Table 5-229 GET /ISAPI/AccessControl/DoorSecurityModule/moduleStatus/capabilities
MethodGET
DescriptionGet the capability of getting the status of the secure door control
unit.
QueryNone.
Intelligent Security API (Access Control on Person) Developer Guide
## 161

RequestNone.
ResponseSucceeded: XML_Cap_ModuleStatus
Failed: XML_ResponseStatus
5.7.11 /ISAPI/AccessControl/maintenanceData?secretkey=
Export the maintenance data.
Request URI Definition
Table 5-230 GET /ISAPI/AccessControl/maintenanceData?secretkey=
MethodGET
DescriptionExport the maintenance data.
Querysecretkey: the verification key, it is provided by the upper layer. It
should be encrypted for exporting and recorded for importing.
security: the version No. of encryption scheme. When security does
not exist, it indicates that the data is not encrypted; when security is
1, it indicates that the nodes of sensitive information in the message
are encrypted in AES128 CBC mode; when security is 2, it indicates
that the nodes of
sensitive information in the message are encrypted
in AES256 CBC mode.
iv: the
initialization vector, and it is required when security is 1 or 2.
RequestNone.
ResponseSucceeded: Opaque data.
Failed: XML_ResponseStatus
## Remarks
The maintenance data include device running logs, events, and so on, and they are used for
troubleshooting.
5.7.12 /ISAPI/AccessControl/OSDPStatus/<ID>?format=json
Get the OSDP (Open Supervised Device Protocol) card reader status.
Intelligent Security API (Access Control on Person) Developer Guide
## 162

Request URI Definition
Table 5-231 GET /ISAPI/AccessControl/OSDPStatus/<ID>?format=json
MethodGET
DescriptionGet the OSDP (Open Supervised Device Protocol) card reader status.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_OSDPStatus
Failed: JSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the OSDP card reader ID which is between 0 and 126, and 127
refers to broadcast. Limited by the device, the OSDP card reader status can only be obtained one
by one.
## 5.7.13
/ISAPI/AccessControl/OSDPStatus/capabilities?format=json
Get the capability of getting the OSDP (Open Supervised Device Protocol) card reader status.
Request URI Definition
Table 5-232 GET /ISAPI/AccessControl/OSDPStatus/capabilities?format=json
MethodGET
DescriptionGet the capability of getting the OSDP (Open Supervised Device
Protocol) card reader status.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_OSDPStatus
Failed: JSON_ResponseStatus
5.7.14 /ISAPI/AccessControl/userData?secretkey=
Import or export person permission data securely.
Intelligent Security API (Access Control on Person) Developer Guide
## 163

Request URI Definition
Table 5-233 GET /ISAPI/AccessControl/userData?secretkey=
MethodGET
DescriptionExport person permission data securely.
Querysecretkey: the verification key, it is provided by the upper layer. It
should be encrypted for exporting and recorded for importing.
security: the version No. of encryption scheme. When security does
not exist, it indicates that the data is not encrypted; when security is
1, it indicates that the nodes of sensitive information in the message
are encrypted in AES128 CBC mode; when security is 2, it indicates
that the nodes of
sensitive information in the message are encrypted
in AES256 CBC mode.
iv: the
initialization vector, and it is required when security is 1 or 2.
RequestNone.
ResponseSucceeded: Opaque data.
Failed: XML_ResponseStatus
Table 5-234 POST /ISAPI/AccessControl/userData?secretkey=
MethodPOST
DescriptionImport person permission data securely.
Querysecretkey: the verification key, it must be the same as the exported
one and should be encrypted for importing.
security: the version No. of encryption scheme. When security does
not exist, it indicates that the data is not encrypted; when security is
1, it indicates that the nodes of sensitive information in the message
are encrypted in AES128 CBC mode; when security is 2, it indicates
that the nodes of
sensitive information in the message are encrypted
in AES256 CBC mode.
iv: the
initialization vector, and it is required when security is 1 or 2.
RequestOpaque data.
ResponseXML_ResponseStatus
## Remarks
The person permission data include permission data of the person's card, face, fingerprint, etc.
Intelligent Security API (Access Control on Person) Developer Guide
## 164

## 5.8 Event Management
5.8.1 /ISAPI/AccessControl/AcsEvent/capabilities?format=json
Get the capability of searching for access control events
Request URI Definition
Table 5-235 GET /ISAPI/AccessControl/AcsEvent/capabilities?format=json
MethodGET
DescriptionGet the capability of searching for access control events.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AcsEvent
Failed: JSON_ResponseStatus
5.8.2 /ISAPI/AccessControl/AcsEvent?format=json
Search for access control events.
Request URI Definition
Table 5-236 POST /ISAPI/AccessControl/AcsEvent?format=json
MethodPOST
DescriptionSearch for access control events.
Queryformat: determine the format of request or response message.
RequestJSON_AcsEventCond
ResponseSucceeded: JSON_AcsEvent
Failed: JSON_ResponseStatus
## Remarks
•The recommended timeout of this URI is 10 seconds.
•If the response message contains picture data, the picture data will be returned by boundary
method; otherwise, the response message in JSON format will be returned directly.
## Example
Sample Response Message with Picture Data
Intelligent Security API (Access Control on Person) Developer Guide
## 165

--MIME_boundary
Content-Type: application/json
Content-Length:480
## {
"AcsEvent":{
"searchID":"",
"responseStatusStrg":"OK",
"numOfMatches":1,
"totalMatches":1,
"InfoList":[{
## "major":1,
## "minor":1,
"time":"2016-12-12T17:30:08+08:00",
"netUser":"",
"remoteHostAddr":"",
"cardNo":"",
"cardType":1,
"whiteListNo":1,
"reportChannel":1,
"cardReaderKind":1,
"cardReaderNo":1,
"doorNo":1,
"verifyNo":1,
"alarmInNo":1,
"alarmOutNo":1,
"caseSensorNo":1,
"RS485No":1,
"multiCardGroupNo":1,
"accessChannel":1,
"deviceNo":1,
"distractControlNo":1,
"employeeNoString":"",
"localControllerID":1,
"InternetAccess":1,
## "type":1,
"MACAddr":"",
"swipeCardType":1,
"serialNo":1,
"channelControllerID":1,
"channelControllerLampID":1,
"channelControllerIRAdaptorID":1,
"channelControllerIREmitterID":1,
"userType":"normal",
"currentVerifyMode":"",
"attendanceStatus":"",
"statusValue":1,
"pictureURL":"",
"picturesNumber":1,
## "filename":"picture1"
## }]
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 166

## }
--MIME_boundary
Content-Disposition: form-data; filename="picture1"; //Picture data
Content-Type:image/jpeg
Content-Length:12345
fgagasghshgshdasdad...
--MIME_boundary--
5.8.3 /ISAPI/AccessControl/AcsEventTotalNum/capabilities?format=json
Get the capability of getting total number of access control events by specific conditions.
Request URI Definition
Table 5-237 GET /ISAPI/AccessControl/AcsEventTotalNum/capabilities?format=json
MethodGET
DescriptionGet the capability of getting total number of access control events by
specific conditions.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_AcsEventTotalNum
Failed: JSON_ResponseStatus
5.8.4 /ISAPI/AccessControl/AcsEventTotalNum?format=json
Get the total number of access control events by specific conditions.
Request URI Definition
Table 5-238 POST /ISAPI/AccessControl/AcsEventTotalNum?format=json
MethodPOST
DescriptionGet the total number of access control events by specific conditions.
Queryformat: determine the format of request or response message.
RequestJSON_AcsEventTotalNumCond
ResponseSucceeded: JSON_AcsEventTotalNum
Failed: JSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 167

## Remarks
The recommended timeout is 30s.
5.8.5 /ISAPI/AccessControl/ClearEventCardLinkageCfg/capabilities?format=json
Get the capability of clearing event and card linkage configuration.
Request URI Definition
Table 5-239 GET /ISAPI/AccessControl/ClearEventCardLinkageCfg/capabilities?format=json
MethodGET
DescriptionGet the capability of clearing event and card linkage configuration.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_ClearEventCardLinkageCfg
Failed: JSON_ResponseStatus
5.8.6 /ISAPI/AccessControl/ClearEventCardLinkageCfg?format=json
Clear event and card linkage configuration.
Request URI Definition
Table 5-240 PUT /ISAPI/AccessControl/ClearEventCardLinkageCfg?format=json
MethodPUT
DescriptionClear event card linkage configuration parameters.
Queryformat: determine the format of request or response message.
RequestJSON_ClearEventCardLinkageCfg
ResponseJSON_ResponseStatus
5.8.7 /ISAPI/AccessControl/DeployInfo
Get the arming information (e.g., arming types).
Intelligent Security API (Access Control on Person) Developer Guide
## 168

Request URI Definition
Table 5-241 GET /ISAPI/AccessControl/DeployInfo
MethodGET
DescriptionGet the arming information (e.g., arming types).
QueryNone.
RequestNone.
ResponseSucceeded: XML_DeployInfo
Failed: XML_ResponseStatus
## Remarks
The client arming supports arming of only one channel and can upload offline events. The real-
time
arming is used for other devices to arm the access control devices, which supports arming of
up to four channels and cannot upload offline events.
## 5.8.8
/ISAPI/AccessControl/DeployInfo/capabilities
Get the capability of getting arming information.
Request URI Definition
Table 5-242 GET /ISAPI/AccessControl/DeployInfo/capabilities
MethodGET
DescriptionGet the capability of getting arming information.
QueryNone.
RequestNone.
ResponseSucceeded: XML_Cap_DeployInfo
Failed: XML_ResponseStatus
5.8.9 /ISAPI/AccessControl/EventCardLinkageCfg/<ID>?format=json
Operations about event and card linkage configuration.
Intelligent Security API (Access Control on Person) Developer Guide
## 169

Request URI Definition
Table 5-243 GET /ISAPI/AccessControl/EventCardLinkageCfg/<ID>?format=json
MethodGET
DescriptionGet the event and card linkage configuration parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_EventCardLinkageCfg
Failed: JSON_ResponseStatus
Table 5-244 PUT /ISAPI/AccessControl/EventCardLinkageCfg/<ID>?format=json
MethodPUT
DescriptionSet the event card linkage parameters.
Queryformat: determine the format of request or response message.
RequestJSON_EventCardLinkageCfg
ResponseJSON_ResponseStatus
## Remarks
The <ID> in the request URI refers to the event No. which starts from 1, and you can get the
maximum number of the events supported by the device from the
configuration capability of the
event and card linkage ( JSON_Cap_EventCardLinkageCfg ).
## 5.8.10
/ISAPI/AccessControl/EventCardLinkageCfg/capabilities?format=json
Get the configuration capability of the event and card linkage.
Request URI Definition
Table 5-245 GET /ISAPI/AccessControl/EventCardLinkageCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of the event and card linkage.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_EventCardLinkageCfg
Failed: JSON_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 170

5.8.11 /ISAPI/AccessControl/EventCardNoList/capabilities?format=json
Get the capability of the list of event and card linkage ID.
Request URI Definition
Table 5-246 GET /ISAPI/AccessControl/EventCardNoList/capabilities?format=json
MethodGET
DescriptionGet the capability of the list of event and card linkage ID.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_EventCardNoList
Failed: JSON_ResponseStatus
5.8.12 /ISAPI/AccessControl/EventCardNoList?format=json
Get the list of event and card linkage ID.
Request URI Definition
Table 5-247 GET /ISAPI/AccessControl/EventCardNoList?format=json
MethodGET
DescriptionGet the list of event and card linkage ID.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_EventCardNoList
Failed: JSON_ResponseStatus
5.8.13 /ISAPI/AccessControl/EventOptimizationCfg/capabilities?format=json
Get the configuration capability of event optimization.
Request URI Definition
Table 5-248 GET /ISAPI/AccessControl/EventOptimizationCfg/capabilities?format=json
MethodGET
DescriptionGet the configuration capability of event optimization.
Intelligent Security API (Access Control on Person) Developer Guide
## 171

Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_Cap_EventOptimizationCfg
Failed: JSON_ResponseStatus
5.8.14 /ISAPI/AccessControl/EventOptimizationCfg?format=json
Operations about the event optimization configuration.
Request URI Definition
Table 5-249 GET /ISAPI/AccessControl/EventOptimizationCfg?format=json
MethodGET
DescriptionGet the event optimization configuration parameters.
Queryformat: determine the format of request or response message.
RequestNone.
ResponseSucceeded: JSON_EventOptimizationCfg
Failed: JSON_ResponseStatus
Table 5-250 PUT /ISAPI/AccessControl/EventOptimizationCfg?format=json
MethodPUT
DescriptionSet the event optimization parameters.
Queryformat: determine the format of request or response message.
RequestJSON_EventOptimizationCfg
ResponseJSON_ResponseStatus
5.9 Alarm or Event Receiving
5.9.1 /ISAPI/Event/notification/alertStream
Get the uploaded heartbeat or alarm/event information.
Intelligent Security API (Access Control on Person) Developer Guide
## 172

Request URL Definition
Table 5-251 GET /ISAPI/Event/notification/alertStream
MethodGET
DescriptionGet the heartbeat or uploaded alarm/event information.
QueryNone.
RequestNone.
ResponseOption 1: XML_EventNotificationAlert_AlarmEventInfo or
XML_EventNotificationAlert_HeartbeatInfo
Option 2: JSON_EventNotificationAlert_Alarm/EventInfo
## Note
The messages here only show the format of alarm/event
information to be uploaded. For details, refer to the corresponding
alarm/event configuration chapters.
## Remarks
•After calling this URL, a persistent connection is set up between the device and the platform, and
the alarm or event information will be uploaded from device continuously once the alarm is
triggered or event occurred.
•You can check if the XML response message is the heartbeat
information according to the nodes
<eventType> and <eventState>. If the values of these two node are "videoloss" and
## "inactive",
respectively, the returned message is the heartbeat information.
## 5.9.2
/ISAPI/Event/notification/httpHosts
Get or set parameters of all listening servers, add a listening server, and delete all listening servers.
Request URL Definition
Table 5-252 GET /ISAPI/Event/notification/httpHosts
MethodGET
DescriptionGet parameters of all listening servers.
Querysecurity: the version No. of encryption scheme. When security does
not exist, it indicates that the data is not encrypted; when security is
1, it indicates that the nodes of sensitive information in the message
are encrypted in AES128 CBC mode; when security is 2, it indicates
that the nodes of sensitive information in the message are encrypted
in AES256 CBC mode.
Intelligent Security API (Access Control on Person) Developer Guide
## 173

RequestNone.
ResponseSucceeded: XML_HttpHostNotificationList
Failed: XML_ResponseStatus
Table 5-253 PUT /ISAPI/Event/notification/httpHosts
MethodPUT
DescriptionSet parameters of all listening servers.
Querysecurity: the version No. of encryption scheme. When security does
not exist, it indicates that the data is not encrypted; when security is
1, it indicates that the nodes of sensitive information in the message
are encrypted in AES128 CBC mode; when security is 2, it indicates
that the nodes of sensitive information in the message are encrypted
in AES256 CBC mode.
RequestXML_HttpHostNotificationList
ResponseXML_ResponseStatus
Table 5-254 POST /ISAPI/Event/notification/httpHosts
MethodPOST
DescriptionAdd a listening server.
Querysecurity: the version No. of encryption scheme. When security does
not exist, it indicates that the data is not encrypted; when security is
1, it indicates that the nodes of sensitive information in the message
are encrypted in AES128 CBC mode; when security is 2, it indicates
that the nodes of sensitive information in the message are encrypted
in AES256 CBC mode.
RequestXML_HttpHostNotification
ResponseXML_ResponseStatus
Table 5-255 DELETE /ISAPI/Event/notification/httpHosts
MethodDELETE
DescriptionDelete all listening servers.
QueryNone.
RequestNone.
ResponseXML_ResponseStatus
Intelligent Security API (Access Control on Person) Developer Guide
## 174

5.9.3 /ISAPI/Event/notification/httpHosts/<ID>/test
Check if the listening server is working normally.
Request URL Definition
Table 5-256 POST /ISAPI/Event/notification/httpHosts/<ID>/test
MethodPOST
DescriptionCheck if the listening server is working normally.
QueryNone.
RequestXML_HttpHostNotification
ResponseSucceeded: XML_HttpHostTestResult
Failed: XML_ResponseStatus
## Remarks
The <ID> in the request URL refers to the listening server ID.
## 5.9.4
/ISAPI/Event/notification/httpHosts/capabilities
Get the configuration capabilities of all listening servers.
Request URL Definition
Table 5-257 GET /ISAPI/Event/notification/httpHosts/capabilities
MethodGET
DescriptionGet the configuration capabilities of all listening servers.
QueryNone.
RequestNone.
ResponseSucceeded: XML_HttpHostNotificationCap
Failed: XML_ResponseStatus
5.9.5 http://ipAddress:portNo/url
Listening sever sends alarm information to alarm center.
Intelligent Security API (Access Control on Person) Developer Guide
## 175

Request URL Definition
Table 5-258 POST http://ipAddress:portNo/url
MethodPOST
DescriptionListening sever sends alarm information to alarm center.
QueryNone.
RequestNone.
ResponseSucceeded: XML_EventNotificationAlert_AlarmEventInfo or
JSON_EventNotificationAlert_Alarm/EventInfo
Failed: XML_ResponseStatus
## Remarks
The default port number in the URL is 80, so the URL without port No. is also valid.
Intelligent Security API (Access Control on Person) Developer Guide
## 176

Chapter 6 Request and Response Message
The request and response messages in XML or JSON format of each request URL are listed here for
reference. You can search for the parameters by the message name.
6.1 JSON Messages
6.1.1 JSON_AcsCfg
AcsCfg message in JSON format
## {
"AcsCfg":{
"RS485Backup": ,
/*optional, boolean, whether to enable downstream RS-485 communication redundancy: "true"-yes, "false"-no*/
"showCapPic": ,
/*optional, boolean, whether to display the captured picture: "true"-yes, "false"-no*/
"showUserInfo": ,
/*optional, boolean, whether to display user information: "true"-yes, "false"-no*/
"overlayUserInfo": ,
/*optional, boolean, whether to overlay user information: "true"-yes, "false"-no*/
"voicePrompt": ,
/*optional, boolean, whether to enable audio announcement: "true"-yes, "false"-no*/
"uploadCapPic": ,
/*optional, boolean, whether to upload the picture from linked capture: "true"-yes, "false"-no*/
"saveCapPic": ,
/*optional, boolean, whether to save the captured picture: "true"-yes, "false"-no*/
"inputCardNo": ,
/*optional, boolean, whether to allow inputting card No. on keypad: "true"-yes, "false"-no*/
"enableWifiDetect": ,
/*optional, boolean, whether to enable Wi-Fi probe: "true"-yes, "false"-no*/
"enable3G4G": ,
/*optional, boolean, whether to enable 3G/4G: "true"-yes, "false"-no*/
## "protocol":"",
/*optional, string, communication protocol type of the card reader: "Private"-private protocol, "OSDP"-OSDP
protocol*/
"showPicture": ,
/*optional, boolean, whether to display the authenticated picture: true-display, false-not display*/
"showEmployeeNo": ,
/*optional, boolean, whether to display the authenticated employee ID: true-display, false-not display*/
"showName":
/*optional, boolean, whether to display the authenticated name: true-display, false-not display*/
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 177

6.1.2 JSON_AcsEvent
AcsEvent message in JSON format
## {
"AcsEvent":{
"searchID": "",
/*required, string type, search ID, which is used to confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
"responseStatusStrg": "",
/*required, string, search status: "OK"-searching completed, "MORE"-searching for more results, "NO MATCH"-no
matched results*/
"numOfMatches": "",
/*required, integer, number of returned results*/
"totalMatches": "",
/*required, integer, total number of matched results*/
"InfoList": [{
/*optional, event details*/
## "major": ,
/*required, integer, major alarm/event types (the type value should be transformed to the decimal number), see
Access Control Event Types for details*/
## "minor": ,
/*required, integer, minor alarm/event types (the type value should be transformed to the decimal number), see
Access Control Event Types for details*/

## "time": "",
/*required, string, time (UTC time), e.g., "2016-12-12T17:30:08+08:00"*/
"netUser": "",
/*optional, string, user name*/
"remoteHostAddr": "",
/*optional, string, remote host address*/
"cardNo": "",
/*optional, string, card No.*/
"cardType": ,
/*optional, integer, card types: 1-normal card, 2-disabled card, 3-blacklist card, 4-patrol card, 5-duress card, 6-super
card, 7-visitor card, 8-dismiss card*/
"whiteListNo": ,
/*optional, integer, whitelist No., which is between 1 and 8*/
"reportChannel": ,
/*optional, integer, channel type for uploading alarm/event: 1-for uploading arming information, 2-for uploading by
central group 1, 3-for uploading by central group 2*/
"cardReaderKind": ,
/*optional, integer, authentication unit type: 1-IC card reader, 2-ID card reader, 3-QR code scanner, 4-fingerprint
module*/
"cardReaderNo": ,
/*Optional, integer, authentication unit No.*/
"doorNo": ,
/*optional, integer, door or floor No.*/
"verifyNo": ,
/*optional, integer, multiple authentication No.*/
"alarmInNo": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 178

/*optional, integer, alarm input No.*/
"alarmOutNo": ,
/*optional, integer, alarm output No.*/
"caseSensorNo": ,
/*optional, integer, event trigger No.*/
"RS485No": ,
/*optional, integer, RS-485 channel No.*/
"multiCardGroupNo": ,
/*optional, integer, group No.*/
"accessChannel": ,
/*optional, integer, swing barrier No.*/
"deviceNo": ,
/*optional, integer, device No.*/
"distractControlNo": ,
/*optional, integer, distributed controller No.*/
"employeeNoString": "",
/*optional, integer, employee No. (person ID)*/
"localControllerID": ,
/*optional, integer, distributed access controller No.: 0-access controller, 1 to 64-distributed access controller No.1 to
distributed access controller No.64*/
"InternetAccess": ,
/*optional, integer, network interface No.: 1-upstream network interface No.1, 2-upstream network interface No.2, 3-
downstream network interface No.1*/
## "type": ,
/*optional, integer, zone type: 0-instant alarm zone, 1-24-hour alarm zone, 2-delayed zone, 3-internal zone, 4-key
zone, 5-fire alarm zone, 6-perimeter protection, 7-24-hour silent alarm zone, 8-24-hour auxiliary zone, 9-24-hour
shock alarm zone, 10-emergency door open alarm zone, 11-emergency door closed alarm zone, 255-none*/
"MACAddr": "",
/*optional, string, physical address*/
"swipeCardType": ,
/*optional, integer, card swiping types: 0-invalid, 1-QR code*/
"serialNo": ,
/*optional, integer, event serial No., which is used to judge whether the event loss occurred*/
"channelControllerID": ,
/*optional, integer, lane controller No.: 1-master lane controller, 2-slave lane controller*/
"channelControllerLampID": ,
/*optional, integer, light board No. of lane controller, which is between 1 and 255*/
"channelControllerIRAdaptorID":  ,
/*optional, integer, IR adapter No. of lane controller, which is between 1 and 255*/
"channelControllerIREmitterID": ,
/*optional, integer, active infrared intrusion detector No. of lane controller, which is between 1 and 255*/
"userType": "",
/*optional, string, person type: "normal"-normal person (household), "visitor"-visitor, "blacklist"-person in blacklist,
## "administrators"-administrator*/
"currentVerifyMode": "",
/*optional, string, authentication mode: "cardAndPw"-card+password, "card", "cardOrPw"-card or password, "fp"-
fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint+card,
"fpAndCardAndPw"-fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or password,
"faceAndFp"-face+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face", "employeeNoAndPw"-
employee No.+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee No.+fingerprint,
"employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face+fingerprint+card,
"faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face, "faceOrfaceAndCard"-
Intelligent Security API (Access Control on Person) Developer Guide
## 179

face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password, "cardOrFpOrPw"-card
or fingerprint or password*/
"picEnable": ,
/*optional, boolean, whether contains picture*/
"attendanceStatus":"",
/*optional, string, attendance status: "undefined", "checkIn"-check in, "checkOut"-check out, "breakOut"-break out,
"breakIn"-break in, "overtimeIn"-overtime in, "overTimeOut"-overtime out*/
"statusValue": ,
/*optional, integer, status value*/
## "filename":
/*optional, string, file name. If multiple pictures are returned at a time, filename of each picture should be unique*/
## }],
"picturesNumber":
/*optional, integer, number of captured pictures if the capture linkage action is configured. This node will be 0 or not
be returned if there is no picture*/
## }
## }
## See Also
## Access Control Event Types
6.1.3 JSON_AcsEventCond
AcsEventCond message in JSON format
## {
"AcsEventCond": {
"searchID": "",
/*required, string type, search ID, which is used to confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
"searchResultPosition": "",
/*required, integer, the start position of the search result in the result list. When there are multiple records and you
cannot get all search results at a time, you can search for the records after the specified position next time*/
"maxResults": "",
/*required, integer, maximum number of search results. If maxResults exceeds the range returned by the device
capability, the device will return the maximum number of search results according to the device capability and will not
return error message*/
## "major": ,
/*required, integer, major alarm/event types (the type value should be transformed to the decimal number), see
Access Control Alarm Types for details*/
## "minor": ,
/*required, integer, minor alarm/event types (the type value should be transformed to the decimal number), see
Access Control Alarm Types for details*/
"startTime": "",
/*optional, string, start time (UTC time), e.g., 2016-12-12T17:30:08+08:00*/
"endTime": "",
/*optional, string, end time (UTC time), e.g.,2017-12-12T17:30:08+08:00*/
"cardNo": "",
/*optional, string, card No.*/
Intelligent Security API (Access Control on Person) Developer Guide
## 180

## "name": "",
/*optional, string，cardholder name*/
"picEnable": ,
/*optional, boolean, whether to contain pictures: "false"-no, "true"-yes*/
"beginSerialNo": ,
/*optional, integer, start serial No.*/
"endSerialNo": ,
/*optional, integer, end serial No.*/
"employeeNoString":"",
/*optional, string, employee No. (person ID)*/
"eventAttribute":"",
/*optional, string, event attribute: "attendance"-valid authentication, "other"*/
"employeeNo":"",
/*optional, string, employee No. (person ID)*/
"timeReverseOrder":
/*optional, boolean, whether to return events in descending order of time (later events will be returned first): true-
yes, false or this node is not returned-no*/
## }
## }
## See Also
## Access Control Event Types
6.1.4 JSON_AcsEventTotalNum
AcsEventTotalNum message in JSON format
## {
"AcsEventTotalNum":{
"totalNum":
/*required, integer, total number of events that match the search conditions*/
## }
## }
6.1.5 JSON_AcsEventTotalNumCond
AcsEventTotalNumCond message in JSON format
## {
"AcsEventTotalNumCond":{
## "major": ,
/*required, integer, major type (the type value should be transformed to the decimal number), refer to Access Control
Event Types for details*/
## "minor": ,
/*required, integer, minor type (the type value should be transformed to the decimal number), refer to Access Control
Event Types for details*/
"startTime":"",
/*optional, string, start time (UTC time), e.g., "2016-12-12T17:30:08+08:00"*/
"endTime":"",
Intelligent Security API (Access Control on Person) Developer Guide
## 181

/*optional, string, end time (UTC time), e.g., "2017-12-12T17:30:08+08:00"*/
"cardNo":"",
/*optional, string, card No.*/
## "name":"",
/*optional, string, cardholder name*/
"picEnable": ,
/*optional, boolean, whether to contain pictures: "true"-yes, "false"-no*/
"beginSerialNo": ,
/*optional, integer, start serial No.*/
"endSerialNo": ,
/*optional, integer, end serial No.*/
"employeeNoString":"",
/*optional, string, employee No. (person ID)*/
"eventAttribute":""
/*optional, string, event attribute: "attendance"-valid authentication, "other"*/
## }
## }
## See Also
## Access Control Event Types
6.1.6 JSON_AcsWorkStatus
AcsWorkStatus message in JSON format
## {
"AcsWorkStatus":{
"doorLockStatus": ,
/*optional, array, door lock status (relay status): 0-normally close, 1-normally open, 2-short-circuit alarm, 3-broken-
circuit alarm, 4-exception alarm. For example, [1,2,1,2] indicates that door lock 1 is normally open, door lock 2 triggers
short-circuit alarm, door lock 3 is normally open, and door lock 4 triggers short-circuit alarm*/
"doorStatus": ,
/*optional, array, door (floor) status: 1-sleep, 2-remain unlocked (free), 3-remain locked (disabled), 4-normal status
(controlled). For example, [1,2,1,2] indicates that door 1 is sleeping, door 2 remains unlocked, door 3 is sleeping, and
door 4 remains unlocked*/
"magneticStatus": ,
/*optional, array, magnetic contact status: 0-normally close, 1-normally open, 2-short-circuit alarm, 3-broken-circuit
alarm, 4-exception alarm. For example, [1,2,1,2] indicates that magnetic contact No.1 is normally open, magnetic
contact No.2 triggers short-circuit alarm, magnetic contact No.3 is normally open, and magnetic contact No.4 triggers
short-circuit alarm*/
"caseStatus": ,
/*optional, array, event trigger status, e.g., [1,3,5] indicates that event trigger No.1, No.3, and No.5 have input*/
"batteryVoltage": ,
/*optional, integer, storage battery power voltage, the actual value will be 10 times of this value, unit: Volt*/
"batteryLowVoltage": ,
/*optional, boolean, whether the storage battery is in low voltage status: "true"-yes, "false"-no*/
"powerSupplyStatus":"",
/*optional, string, device power supply status: "ACPowerSupply"-alternative current, "BatteryPowerSupply"-storage
battery power supply*/
"multiDoorInterlockStatus":"",
Intelligent Security API (Access Control on Person) Developer Guide
## 182

/*optional, string, multi-door interlocking status: "close"-disabled, "open"-enabled*/
"antiSneakStatus":"",
/*optional, string, anti-passback status: "close"-disabled, "open"-enabled*/
"hostAntiDismantleStatus":"",
/*optional, string, tampering status of the access control device: "close"-disabled, "open"-enabled*/
"indicatorLightStatus":"",
/*optional, string, indicator status: "offLine"-offline, "onLine"-online*/
"cardReaderOnlineStatus": ,
/*optional, array, online status of the authentication unit, e.g., [1,3,5] indicats that authentication unit No.1, No.3, and
No.5 are online*/
"cardReaderAntiDismantleStatus": ,
/*optional, array, tampering status of the authentication unit, e.g., [1,3,5] indicates that the tampering function of
authentication unit No.1, No.3, and No.5 is enabled*/
"cardReaderVerifyMode": ,
/*optional, array, current authentication mode of the authentication unit: 1-sleep, 2-card+password, 3-card, 4-card or
password, 5-fingerprint, 6-fingerprint+password, 7-fingerprint or card, 8-fingerprint+card, 9-fingerprint+card
+password, 10-face or fingerprint or card or password, 11-face+fingerprint, 12-face+password, 13-face+card, 14-face,
15-employee No.+password, 16-fingerprint or password, 17-employee No.+fingerprint, 18-employee No.+fingerprint
+password, 19-face+fingerprint+card, 20-face+password+fingerprint, 21-employee No.+face, 22-face or face+card, 23-
fingerprint or face, 24-card or face or password, 25-card or face, 26-card or face or fingerprint, 27-card or fingerprint
or password. For example, [3,5,3,5] indicates that the authentication mode of authentication unit 1 is "card", the
authentication mode of authentication unit 2 is "fingerprint", the authentication mode of authentication unit 3 is
"card", and the authentication mode of authentication unit 4 is "fingerprint"*/
"setupAlarmStatus": ,
/*optional, array, No. of armed input port, e.g., [1,3,5] indicates that input port No.1, No.3, and No.5 are armed*/
"alarmInStatus": ,
/*optional, array, No. of input port with alarms, e.g., [1,3,5] indicates that input port No.1, No.3, and No.5 trigger
alarms*/
"alarmOutStatus": ,
/*optional, array, No. of output port with alarms, e.g., [1,3,5] indicates that output port No.1, No.3, and No.5 trigger
alarms*/
"cardNum": ,
/*optional, integer, number of added cards*/
"fireAlarmStatus":"",
/*optional, string, fire alarm status: "normal", "shortCircuit"-short-circuit alarm, "brokenCircuit"-broken-circuit alarm*/
"batteryChargeStatus":"",
/*optional, string, battery charging status: "charging", "uncharged"*/
"masterChannelControllerStatus":"",
/*optional, string, online status of the master lane controller: "offLine"-offline, "onLine"-online*/
"slaveChannelControllerStatus":"",
/*optional, string, online status of the slave lane controller: "offLine"-offline, "onLine"-online*/
"antiSneakServerStatus":""
/*optional, string, anti-passback server status: "disable"-disabled, "normal", "disconnect"-disconnected*/
## }
## }
6.1.7 JSON_AddFaceRecordCond
Message about conditions of adding face record, it is in JSON format
Intelligent Security API (Access Control on Person) Developer Guide
## 183

## {
"faceURL": "",
/*optional, string type, picture storage URL inputted when uploading the face picture by URL, the maximum length is
256 bytes*/
"faceLibType": "",
/*required, face picture library type: "blackFD"-list library, "staticFD"-static library, string type, the maximum size is 32
bytes*/
## "FDID": "",
/*required, face picture library ID, string type, the maximum size is 63 bytes*/
## "FPID": "",
/*optional, string type, face record ID, it can be generated by device or inputted. If it is inputted, it should be the
unique ID with the combination of letters and digits, and the maximum length is 63 bytes; if it is generated by the
device automatically, it is the same as the employee No. (person ID)*/
## "name": "",
/*required, name of person in the face picture, string type, the maximum size is 96 bytes*/
## "gender": "",
/*optional, gender of person in the face picture: male, female, unknown, string type, the maximum size is 32 bytes*/
"bornTime": "",
/*required, birthday of person in the face picture, ISO8601 time format, string type, the maximum size is 20 bytes*/
## "city": "",
/*optional, city code of birth for the person in the face picture, string type, the maximum size is 32 bytes*/
"certificateType": "",
/*optional, string type, the max. size is 10 bytes, certificate type: "officerID"-officer ID, "ID"-identify card, passport,
other*/
"certificateNumber": "",
/*optional, certificate No., string, the max. size is 32 bytes*/
"caseInfo": "",
/*optional, case information, string type, the max. size is 192 bytes, it is valid when faceLibType is "blackFD".*/
## "tag": "",
/*optional, custom tag, up to 4 tags, which are separated by commas, string type, the max. size is 195 bytes, it is valid
when faceLibType is "blackFD".*/
## "address": "",
/*optional, person address, string type, the max. size is 192 bytes, it is valid when faceLibType is "staticFD".*/
"customInfo": "",
/*optional, custom information, string type, the max. size is 192 bytes, it is valid when faceLibType is "staticFD".*/
"modelData":""
/*optional, string type, target model data, non-modeled binary data needs to be encrypted by Base64 during
transmission*/
## "transfer":true
/*optional, boolean, whether to enable transfer*/
## }
## Remarks
If the field "faceURL" exists in the message, it indicates that the picture is uploaded via URL, and
the "faceURL" of message should be set to picture URL. Otherwise, the picture is uploaded as
binary data, which can be followed the message in JSON format, and separated by "boundary". See
the example below.
## Example
Add Face Record When Binary Picture is Uploaded in Form Format
Intelligent Security API (Access Control on Person) Developer Guide
## 184

1) POST /ISAPI/Intelligent/FDLib/FaceDataRecord?format=json
2) Accept: text/html, application/xhtml+xml,
3) Accept-Language: us-EN
4) Content-Type: multipart/form-data; boundary=---------------------------7e13971310878
5) User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)
6) Accept-Encoding: gzip, deflate
## 7) Host: 10.10.36.29:8080
8) Content-Length: 9907
9) Connection: Keep-Alive
10) Cache-Control: no-cache
## 11)
## 12) -----------------------------7e13971310878
13) Content-Disposition: form-data; name="FaceDataRecord";
14) Content-Type: application/json
15) Content-Length: 9907
## 16)
## 17) {
a) "faceLibType": "blackFD",
b) "FDID": "1223344455566788",
c) "FPID": "11111aa",
d) "name": "Eric",
e) "gender": "male",
f) "bornTime": "2004-05-03",
g) "city": “130100”,
h) "certificateType": "officerID",
i) "certificateNumber": "",
j) "caseInfo": "",
k) "tag": "aa,bb,cc,dd",
l) "address": "",
m) "customInfo": ""
## 18) }
## 19) -----------------------------7e13971310878
20) Content-Disposition: form-data; name="FaceImage";
21) Content-Type: image/jpeg
22) Content-Length: 9907
## 23)
## 24) ......JFIF.....`.`.....C...........     .
## 25) ..
## 26) ................. $.' ",#..(7),01444.'9=82<.342...C.            ....
## 27) -----------------------------7e13971310878--
## Note
•In line 4, "Content-Type:
multipart/form-data" indicates that the data is sent in form format. The
"boundary" is a delimiter, you can assign value to it for distinguishing other ones.
•In line 12, the request body consists of multiple same parts, and each part starts with "-" and
from the customized "boundary" delimiter, the contents after the delimiter is the description of
this part.
•In line 13,
"Content-Disposition" refers to condition parameters, when adding face record, the
"name" must be set to "FaceDataRecord".
Intelligent Security API (Access Control on Person) Developer Guide
## 185

•In line 14, "Content-Type" refers to JSON format, which based on UTF-8 character set.
•In line 15, "Content-Length" refers to the size of data (contains the "\r\n" escape characters)
from line 16 to line 18.
•In line 16, the "\r\n\r\n" escape characters must be entered.
•Line 19 is the start delimiter of next part.
•Line 20 is the binary picture data, and the "name" must be set to "FaceImage".
•Line 21 is the format of the binary picture data. Here, "image/jpeg" indicates that the following
contents are JPEG format picture data.
•In line 23, the "\r\n\r\n" escape characters must be entered.
•In line 27, the customized "boundary" indicates the end of request body.
6.1.8 JSON_AddFaceRecordResult
Message about the result of adding the face record to face picture library, it is in JSON format.
## {
"requestURL": "",
"statusCode": "",
"statusString": "",
"subStatusCode": "",
"errorCode": "",
"errorMsg": "",
/*see the
description of this node and above nodes in the message of JSON_ResponseStatus*/
## "FPID": ""
/*optional, string type, face record ID returned when the face record is added, it is unique, and the maximum size is
63 bytes. This node is valid when errorCode is "1" and errorMsg is "ok"*/
## }
## See Also
JSON_ResponseStatus
6.1.9 JSON_AlarmInCfg
AlarmInCfg message in JSON format
## {
"AlarmInCfg":{
## "name":"",
/*optional, string, name*/
"detectorType": ,
/*optional, integer, detector type: 0-panic switch, 1-magnetic contact, 2-smoke detector, 3-active infrared detector, 4-
passive infrared detector, 5-glass break detector, 6-shock detector, 7-dual technology motion detector, 8-triplex
technology detector, 9-humidity detector, 10-heat detector, 11-gas detector, 12-follow-up switch, 13-control switch,
14-smart lock, 15-water detector, 16-motion detector, 17-open-close detector, 18-wireless single-zone module, 19-
curtain PIR detector, 21-door bell switch, 22-medical help button, 23-outdoor dual technology sensor, 65535-other
detector*/
Intelligent Security API (Access Control on Person) Developer Guide
## 186

## "type": ,
/*optional, integer, zone type: 0-instant alarm zone, 1-24-hour zone, 2-delayed zone, 3-internal zone, 4-key zone, 5-
fire alarm zone, 6-perimeter zone, 7-24-hour silent alarm zone, 8-24-hour auxiliary zone, 9-24-hour shock alarm zone,
10-unlocking all doors zone, 11-locking all doors zone, 12-over-time zone, 13-panic zone, 255-none*/
"uploadAlarmRecoveryReport": ,
/*optional, boolean, whether to upload zone alarm recovery report: "true"-yes, "false"-no*/
## "param": ,
/*optional, integer, zone parameter, delay time of the delayed zone*/
"AlarmTime":[{
/*optional, time period of arming*/
## "week":"",
/*optional, string, day of the week: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"*/
## "id": ,
/*optional, integer, time period No., which is between 1 and 8*/
"beginTime":"",
/*optional, start time of the time period*/
"endTime":""
/*optional, end time of the time period*/
## }],
"associateAlarmOut": ,
/*optional, array, alarm outputs linked to the alarm input, e.g., [1,3,5] indicates that alarm output No. 1, No. 3, and
No. 5 are linked to the alarm input*/
"associateSirenOut": ,
/*optional, array, siren outputs linked to the alarm input, e.g., [1,3,5] indicates that siren output No. 1, No. 3, and No.
5 are linked to the alarm input*/
"sensitivityParam": ,
/*optional, integer, zone sensitivity parameter: 0-10, 1-250, 2-500, 3-750, unit: millisecond*/
"arrayBypass": ,
/*optional, boolean, whether to support group bypass: "true"-yes, "false"-no*/
"jointSubSystem": ,
/*ro, opt, integer, No. of the partition that the zone belongs to*/
"moduleStatus":"",
/*optional, string, module status: "onLine"-online, "offLine"-offline*/
"moduleAddress": ,
/*optional, integer, module address, the extension module is between 0 and 255, 65535-invalid*/
"moduleChan": ,
/*optional, integer, module channel No., which starts from 1, and the maximum value depends on the module type,
## 255-invalid*/
"moduleType": ,
/*optional, integer, module type: 1-local zone, 2-single zone, 3-dual zone, 4-8 zone, 5-8-channel sensor zone, 6-single-
zone trigger, 7-one-door distributed controller, 8-two-door distributed controller, 9-four-door distributed controller, 10-
eight-zone wireless*/
## "zone": ,
/*ro, opt, integer, zone No.*/
"inDelay": ,
/*optional, integer, enter delay, which is between 0 and 255, unit: second*/
"outDelay": ,
/*optional, integer, exit delay, which is between 0 and 255, unit: second*/
"alarmType":"",
/*optiona, string, alarm device type: "alwaysOpen"-remain open, "alwaysClose"-remain close*/
"zoneResistor": ,
/*optional, integer, zone resistor: 1-2.2, 2-3.3, 3-4.7, 4-5.6, 5-8.2, 255-custom, unit: kilohm*/
Intelligent Security API (Access Control on Person) Developer Guide
## 187

"zoneResistorManual": ,
/*optional, float type, zone resistor set manually, which is between 1.0 and 10.0 and is accurate to one decimal place.
This field is valid when zoneResistor is 255*/
"detectorSerialNo":"",
/*ro, opt, string, detector serial No.*/
"zoneSignalType":"",
/*ro, opt, string, transmission type of zone signal: "wiredArea"-wired zone, "wirelessZone"-wireless zone*/
"disableDetectorTypeCfg": ,
/*optional, boolean, whether to enable configuring detector type: "true"-yes, "false"-no*/
"timeOutRange": ,
/*optional, integer, timeout range: 0-ranging from 1 to 599, 1-ranging from 1 to 65535, unit: second*/
"associateLampOut": ,
/*optional, array, alarm lamp output, e.g., [1,3,5] indicates that alarm lamp output No. 1, No. 3, and No. 5*/
"timeOut": ,
/*optional, integer, timeout, unit: second*/
"detectorSignalIntensity": ,
/*ro, opt, integer, detector signal strength, which is between 0 and 100*/
"timeOutMethod":""
/*optional, string, timing type of the over-time zone: "trigger"-trigger timing, "resume"-reset timing*/
## }
## }
6.1.10 JSON_AlarmOutCfg
AlarmOutCfg message in JSON format
## {
"AlarmOutCfg":{
## "name":"",
/*optional, string, name*/
## "delay": ,
/*optional, integer, output delay, which is between 0 and 3599, 0 refers to continuous output, unit: second*/
"triggerIndex": ,
/*ro, opt, integer, trigger No.*/
"associateAlarmIn": ,
/*optional, array, alarm input channel followed by the siren (multiple alarm inputs trigger the same siren output
simultaneously), e.g., [1,3,5] indicates that the siren follows alarm input No. 1, No. 3, and No. 5*/
"moduleType": ,
/*optional, integer, external trigger type: 1-local trigger, 2-4-channel trigger, 3-8-channel trigger, 4-single-zone trigger,
5-32-channel trigger, 6-1-door distributed controller, 7-2-door distributed controller, 8-4-door distributed controller,
9-2-channel trigger*/
"moduleStatus":"",
/*optional, string, external trigger status: "onLine"-online, "offLine"-offline*/
"moduleAddress": ,
/*optional, integer, external trigger address, the extension module is between 0 and 255, 65535-invalid*/
"moduleChan": ,
/*optional, integer, external trigger channel No., which starts from 1, the maximum value depends on the module
type, 255-invalid*/
"workMode":"",
/*optionao, string, working mode: "linkage", "followUp"-follow-up*/
"alarmOutMode":"",
Intelligent Security API (Access Control on Person) Developer Guide
## 188

/*optional, string, output mode: "nonPluse"-non-pulse mode, "pluse"-pulse mode*/
"timeOn": ,
/*optional, integer, open duration, which is between 1 and 60, unit: second*/
"timeOff":
/*optional, integer, close duration, which is between 1 and 60, unit: second*/
## }
## }
6.1.11 JSON_AlarmOutCfgList
AlarmOutCfgList message in JSON format
## {
"AlarmOutCfgList":[{
"AlarmOutCfg":{
## "name":"",
/*optional, string, name*/
## "delay": ,
/*optional, int, output delay, it is between 0 and 3599, 0-continuous output, unit: second*/
"triggerIndex": ,
/*ro, opt, int, trigger No.*/
"associateAlarmIn": ,

/*optional, array, alarm input channels that can trigger the siren, multiple alarm inputs trigger the same siren
simultaneously. For example, [1,3,5] indicates the siren can be triggered by the alarm input 1, alarm input 3, and alarm
input 5*/
"moduleType": ,
/*optional, int, external trigger type: 1-local trigger, 2-4-channel trigger, 3-8-channel trigger, 4-single-zone trigger, 5-32-
channel trigger, 6-one-door distributed controller, 7-two-door distributed controller, 8-four-door distributed controller,
9-2-channel trigger*/
"moduleStatus":"",
/*optional, string, external trigger status: "onLine"-online, "offLine"-offline*/
"moduleAddress": ,
/*optional, int, external trigger address, the extension module is from 0 to 255, 65535-invalid*/
"moduleChan": ,
/*optional, int, channel No. of the external trigger, it starts from 1 and the maximum value depends on the module
type, 255-invalid*/
"workMode":"",
/*optional, string, working mode: "linkage", "followUp"-follow-up*/
"alarmOutMode":"",
/*optional, string, output mode: "nonPluse"-non-pulse mode, "pluse"-pulse mode*/
"timeOn": ,
/*optional, int, open duration, it is between 1 and 60, unit: second*/
"timeOff":
/*optional, int, closed duration, it is between 1 and 60, unit: second*/
## }
## }]
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 189

6.1.12 JSON_AntiSneakCfg
AntiSneakCfg message in JSON format
## {
"AntiSneakCfg": {
## "enable": ,
/*required, boolean, whether to enable anti-passing back*/
"startCardReaderNo":
/*optional, integer, first card reader No., 0-no first card reader*/
## }
## }
## 6.1.13
JSON_AttendanceStatusModeCfg
AttendanceStatusModeCfg message in JSON format
## {

"AttendanceStatusModeCfg":{
## "mode":"",
/*optional, string type, attendance mode: "disable", "manual", "auto"-automatic, "manualAndAuto"-manual and
automatic*/
"manualStatusTime": ,
/*optional, integer type, duration of manual attendance status, unit: second. This node is valid when mode is
"manual" or "manualAndAuto"*/
"attendanceStatusEnable":
/*optional, boolean type, whether to enable attendance status: "true"-yes (if the device has not been configured with
start time and end time of the automatic attendance mode, the user will be prompted to select the attendance
status), "false"-no (if the device has not been configured with start time and end time of the automatic attendance
mode, there will be no prompt)*/
## }
## }
## 6.1.14
JSON_AttendanceStatusRuleCfg
AttendanceStatusRuleCfg message in JSON format
## {
"AttendanceStatusRuleCfg":{
"statusKey":"",
/*optional, string type, status shortcut key: "Up", "Down", "Left", "Right", "ESC", "OK", "notConfig". If this node is not
configured, this node will be set to "notConfig" by default*/
"statusValue": ,
/*optional, integer type, status value*/
"WeekPlanCfg":[{
/*optional, schedule*/
## "week":"",
/*optional, string type, day of the week: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
Intelligent Security API (Access Control on Person) Developer Guide
## 190

"Sunday"*/
## "enable": ,
/*optional, boolean type, whether to enable: "true"-yes, "false"-no*/
"beginTime":""
/*optional, start time*/
## }]
## }
## }
6.1.15 JSON_Cap_AcsCfg
AcsCfg capability message in JSON format
## {
"AcsCfg":{
"RS485Backup":"true,false",
/*optional, boolean, whether to enable downstream RS-485 communication redundancy: "true"-yes, "false"-no*/
"showCapPic":"true,false",
/*optional, boolean, whether to display the captured picture: "true"-yes, "false"-no*/
"showUserInfo":"true,false",
/*optional, boolean, whether to display user information: "true"-yes, "false"-no*/
"overlayUserInfo":"true,false",
/*optional, boolean, whether to overlay user information: "true"-yes, "false"-no*/
"voicePrompt":"true,false",
/*optional, boolean, whether to enable audio announcement: "true"-yes, "false"-no*/
"uploadCapPic":"true,false",
/*optional, boolean, whether to upload the picture from linked capture: "true"-yes, "false"-no*/
"saveCapPic":"true,false",
/*optional, boolean, whether to save the capture picture: "true"-yes, "false"-no*/
"inputCardNo":"true,false",
/*optional, boolean, whether to allow inputting card No. on keypad: "true"-yes, "false"-no*/
"enableWifiDetect":"true,false",
/*optional, boolean, whether to enable Wi-Fi probe: "true"-yes, "false"-no*/
"enable3G4G":"true,false",
/*optional, boolean, whether to enable 3G/4G: "true"-yes, "false"-no*/
## "protocol":{
/*optional, string, communication protocol type of the card reader: "Private"-private protocol, "OSDP"-OSDP
protocol*/
"@opt":"Private,OSDP"
## },
"showPicture":"true,false",
/*optional, boolean, whether to display the authenticated picture: "true"-display, "false"-not display*/
"showEmployeeNo":"true,false",
/*optional, boolean, whether to display the authenticated employee ID: "true"-display, "false"-not display*/
"showName":"true,false"
/*optional, boolean, whether to display the authenticated name: "true"-display, "false"-not display*/
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 191

6.1.16 JSON_Cap_AcsEvent
AcsEvent capability message in JSON format
## {
"AcsEvent":{
"AcsEventCond":{
/*optional, search conditions*/
"searchID":{
/*required, string type, search ID, which is used to confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
## "@min": ,
## "@max":
## },
"searchResultPosition":{
/*required, integer, the start position of the search result in the result list. When there are multiple records and you
cannot get all search results at a time, you can search for the records after the specified position next time*/
## "@min": ,
## "@max":
## },
"maxResults":{
/*required, integer, maximum number of search results*/
## "@min": ,
## "@max":
## },
## "major":{
/*required, integer, major alarm/event types (the type value should be transformed to the decimal number), refer to
Access Control Event Types for details*/
## "@opt": "0,1,2,3,5"
## },
"minorAlarm":{
/*required, integer, minor alarm type (the type value should be transformed to the decimal number), refer to Access
Control Event Types for details*/
## "@opt": "1024,1025,1026,1027..."
## },

"minorException":{
/*required, integer, minor exception type (the type value should be transformed to the decimal number), refer to
Access Control Event Types for details*/
## "@opt": "39,58,59,1024..."
## },

"minorOperation":{
/*required, integer, minor operation type (the type value should be transformed to the decimal number), refer to
Access Control Event Types for details*/
## "@opt": "80,90,112,113..."
## },
"minorEvent":{
/*required, integer, minor event type (the type value should be transformed to the decimal number), refer to Access
Control Event Types for details*/
## "@opt": "1,2,3,4..."
## },
Intelligent Security API (Access Control on Person) Developer Guide
## 192

"startTime":{
/*optional, string, start time (UTC time)*/
## "@min": ,
## "@max":
## },
"endTime":{
/*optional, string, end time (UTC time)*/
## "@min": ,
## "@max":
## },
"cardNo":{
/*optional, string, card No.*/
## "@min": ,
## "@max":
## },
## "name":{
/*optional, string，cardholder name*/
## "@min": ,
## "@max":
## },
"picEnable": "true,false",
/*optional, boolean, whether to contain pictures: "false"-no, "true"-yes*/
"beginSerialNo":{
/*optional, integer, start serial No.*/
## "@min": ,
## "@max":
## },
"endSerialNo":{
/*optional, integer, end serial No.*/
## "@min": ,
## "@max":
## },
"employeeNoString":{
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## },
"eventAttribute":{
/*optional, string, event attribute: "attendance"-valid authentication, "other"*/
## "@opt":"attendance,other"
## },
"employeeNo": {
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## },
"timeReverseOrder": "true,false"
/*optional, boolean, whether to return events in descending order of time (later events will be returned first): true-
yes, false or this node is not returned-no*/
## },
"InfoList":{
/*optional, event details*/
Intelligent Security API (Access Control on Person) Developer Guide
## 193

"maxSize": 10,
## "time":{
/*required, string, time (UTC time)*/
## "@min": ,
## "@max":
## },
"netUser":{
/*optional, string, user name*/
## "@min": ,
## "@max":
## },
"remoteHostAddr":{
/*optional, string, remote host address*/
## "@min": ,
## "@max":
## },
"cardNo":{
/*optional, string, card No.*/
## "@min": ,
## "@max":
## },
"cardType":{
/*optional, integer, card type: "1"-normal card, "2"-disabled card, "3"-blacklist card, "4"-patrol card, "5"-duress card,
"6"-super card, "7"-visitor card, "8"-dismiss card*/
## "@opt": "1,2,3,4,5,6,7,8"
## },
"whiteListNo":{
/*optional, integer, whitelist No., which is between 1 and 8*/
## "@min": ,
## "@max":
## },
"reportChannel":{
/*optional, integer, channel type for uploading alarm/event: "1"-for uploading arming information, "2"-for uploading
by central group 1, "3"-for uploading by central group 2*/
## "@opt": "1,2,3"
## },
"cardReaderKind":{
/*optional, integer, authentication unit type: "1"-IC card reader, "2"-ID card reader, "3"-QR code scanner, "4"-
fingerprint module*/
## "@opt": "1,2,3,4"
## },
"cardReaderNo":{
/*Optional, integer, authentication unit No.*/
## "@min": ,
## "@max":
## },
"doorNo":{
/*optional, integer, door or floor No.*/
## "@min": ,
## "@max":
## },
"verifyNo":{
Intelligent Security API (Access Control on Person) Developer Guide
## 194

/*optional, integer, multiple authentication No.*/
## "@min": ,
## "@max":
## },
"alarmInNo":{
/*optional, integer, alarm input No.*/
## "@min": ,
## "@max":
## },
"alarmOutNo":{
/*optional, integer, alarm output No.*/
## "@min": ,
## "@max":
## },
"caseSensorNo":{
/*optional, integer, event trigger No.*/
## "@min": ,
## "@max":
## },
"RS485No":{
/*optional,  integer, RS-485 channel No.*/
## "@min": ,
## "@max":
## },
"multiCardGroupNo":{
/*optional, integer, group No.*/
## "@min": ,
## "@max":
## },
"accessChannel":{
/*optional, integer, swing barrier No.*/
## "@min": ,
## "@max":
## },
"deviceNo":{
/*ptional, integer, device No.*/
## "@min": ,
## "@max":
## },
"distractControlNo":{
/*optional, integer, distributed access controller No.*/
## "@min": ,
## "@max":
## },
"employeeNo":{
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## },
"localControllerID":{
/*optional, integer, distributed access controller No.: "0"-access controller, "1" to "64"-distributed access controller
No.1 to distributed access controller No.64*/
Intelligent Security API (Access Control on Person) Developer Guide
## 195

## "@min": ,
## "@max":
## },
"InternetAccess":{
/*optional, integer, network interface No.: "1"-upstream network interface No.1, "2"-upstream network interface No.
2, "3"-downstream network interface No.1*/
## "@min": ,
## "@max":
## },
## "type":{
/*optional, integer, zone type: "0"-instant alarm zone, "1"-24-hour alarm zone, "2"-delayed zone, "3"-internal zone,
"4"-key zone, "5"-fire alarm zone, "6"-perimeter protection, "7"-24-hour slient alarm zone, "8"-24-hour auxiliary zone,
"9"-24-hour shock alarm zone, "10"-emergency door open alarm zone, "11"-emergency door closed alarm zone,
## "255"-none*/
## "@opt": "0,1,2,3,4,5,6,7,8,9,10,11,255"
## },
"MACAddr":{
/*optional, string, physical address*/
## "@min": ,
## "@max":
## },
"swipeCardType":{
/*optional, integer, card swiping type: "0"-invalid, "1"-QR code*/
## "@opt": "0,1"
## },
"serialNo":{
/*optional, integer, event serial No., which is used to judge whether the event loss occurred*/
## "@min": ,
## "@max":
## },
"channelControllerID":{
/*optional, integer, lane controller No.: "1"-master lane controller, "2"-slave lane controller*/
## "@opt": "0,1"
## },
"channelControllerLampID":{
/*optional, integer, light board No. of lane controller, which is between 1 and 255*/
## "@min": ,
## "@max":
## },
"channelControllerIRAdaptorID":{
/*optional, integer, IR adapter No. of lane controller, which is between 1 and 255*/
## "@min": ,
## "@max":
## },
"channelControllerIREmitterID":{
/*optional, integer, active infrared intrusion detector No. of lane controller, which is between 1 and 255*/
## "@min": ,
## "@max":
## },
"userType":{
/*optional, string, person types: "normal"-normal person (household), "visitor"-visitor, "blacklist"-person in blacklist,
## "administrators"-administrator*/
Intelligent Security API (Access Control on Person) Developer Guide
## 196

"@opt": "normal,visitor,blackList,administrators"
## },
"currentVerifyMode": {
/*optional, string, authentication modes: "cardAndPw"-card+password, "card", "cardOrPw"-card or password, "fp"-
fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint+card,
"fpAndCardAndPw"-fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or password,
"faceAndFp"-face+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face", "employeeNoAndPw"-
employee No.+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee No.+fingerprint,
"employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face+fingerprint+card,
"faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face, "faceOrfaceAndCard"-
face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password, "cardOrFpOrPw"-card
or fingerprint or password*/
## "@opt":
"cardAndPw,card,cardOrPw,fp,fpAndPw,fpOrCard,fpAndCard,fpAndCardAndPw,faceOrFpOrCardOrPw,faceAndFp,faceA
ndPw,faceAndCard,face,employeeNoAndPw,fpOrPw,employeeNoAndFp,employeeNoAndFpAndPw,faceAndFpAndCard,
faceAndPwAndFp,employeeNoAndFace,faceOrfaceAndCard,fpOrface,cardOrfaceOrPw,cardOrFpOrPw"
## },
"picEnable": "true,false"
/*optional, boolean, whether to contain pictures*/
## },
"picturesNumber":{
/*optional, integer, number of captured pictures if the capture linkage action is configured. This node will be 0 or not
be returned if there is no picture*/
## "@min": ,
## "@max":
## },
"attendanceStatus":{
/*optional, string, attendance status: "undefined", "checkIn"-check in, "checkOut"-check out, "breakOut"-break out,
"breakIn"-break in, "overtimeIn"-overtime in, "overTimeOut"-overtime out*/
"@opt":"undefined,checkIn,checkOut,breakOut,breakIn,overtimeIn,overtimeOut"
## },
"statusValue":{
/*optional, integer, status value*/
## "@min":0,
## "@max":255
## }
## }
## }
## See Also
## Access Control Event Types
6.1.17 JSON_Cap_AcsEventTotalNum
AcsEventTotalNum capability message in JSON format
## {
"AcsEvent":{
"AcsEventTotalNumCond":{
/*optional, search conditions*/
Intelligent Security API (Access Control on Person) Developer Guide
## 197

## "major":{
/*required, integer type, major type (the type value should be transformed to the decimal number): 0-all, 1-major
alarm type, 2-major exception type, 3-major operation type, 5-major event type, refer to
## Access Control Event Types
for details*/
## "@opt":"0,1,2,3,5"
## },
"minorAlarm":{
/*required, integer, minor alarm type (the type value should be transformed to the decimal number), refer to Access
Control Event Types for details*/
## "@opt":"1024,1025,1026,1027..."
## },
"minorException":{
/*required, integer, minor exception type (the type value should be transformed to the decimal number), refer to
Access Control Event Types for details*/
## "@opt":"39,58,59,1024..."
## },
"minorOperation":{
/*required, integer, minor operation type (the type value should be transformed to the decimal number), refer to
Access Control Event Types for details*/
## "@opt":"80,90,112,113..."
## },
"minorEvent":{
/*required, integer, minor event type (the type value should be transformed to the decimal number), refer to Access
Control Event Types for details*/
## "@opt":"1,2,3,4..."
## },
"startTime":{
/*optional, string, start time (UTC time)*/
## "@min": ,
## "@max":
## },
"endTime":{
/*optional, string, end time (UTC time)*/
## "@min": ,
## "@max":
## },
"cardNo":{
/*optional, string, card No.*/
## "@min": ,
## "@max":
## },
## "name":{
/*optional, string, cardholder name*/
## "@min": ,
## "@max":
## },
"picEnable":"true,false",
/*optional, boolean, whether to contain pictures: "false"-no, "true"-yes*/
"beginSerialNo":{
/*optional, integer, start serial No.*/
## "@min": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 198

## "@max":
## },
"endSerialNo":{
/*optional, integer, end serial No.*/
## "@min": ,
## "@max":
## },
"employeeNoString":{
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## },
"eventAttribute":{
/*optional, string, event attribute: "attendance"-valid authentication, "other"*/
## "@opt":"attendance,other"
## }
## },
"totalNum":{
/*required, integer, total number of events that match the search conditions*/
## "@min": ,
## "@max":
## }
## }
## }
## See Also
## Access Control Event Types
6.1.18 JSON_Cap_AcsWorkStatus
AcsWorkStatus capability message in JSON format
## {
"AcsWorkStatus":{
"doorLockStatus":{
/*optional, array, door lock status (relay status): 0-normally close, 1-normally open, 2-short-circuit alarm, 3-broken-
circuit alarm, 4-exception alarm*/
## "@opt":"0,1,2,3,4"
## },
"doorStatus":{
/*optional, array, door (floor) status: 1-sleep, 2-remain unlocked (free), 3-remain locked (disabled), 4-normal status
## (controlled)*/
## "@opt":"1,2,3,4"
## },
"magneticStatus":{
/*optional, array, magnetic contact status: 0-normally close, 1-normally open, 2-short-circuit alarm, 3-broken-circuit
alarm, 4-exception alarm*/
## "@opt":"0,1,2,3,4"
## },
"caseStatus":{
Intelligent Security API (Access Control on Person) Developer Guide
## 199

/*optional, array, event trigger status*/
## "@min": ,
## "@max":
## },
"batteryVoltage":{
/*optional, integer, storage battery power voltage, the actual value will be 10 times of this value, unit: Volt*/
## "@min": ,
## "@max":
## },
"batteryLowVoltage":"true,false",
/*optional, boolean, whether the storage battery is in low voltage status: "true"-yes, "false"-no*/
"powerSupplyStatus":{
/*optional, string, device power supply status: "ACPowerSupply"-alternative current, "BatteryPowerSupply"-storage
battery power supply*/
"@opt":"ACPowerSupply,BatteryPowerSupply"
## },
"multiDoorInterlockStatus":{
/*optional, string, multi-door interlocking status: "close"-disabled, "open"-enabled*/
## "@opt":"close,open"
## },
"antiSneakStatus":{
/*optional, string, anti-passback status: "close"-disabled, "open"-enabled*/
## "@opt":"close,open"
## },
"hostAntiDismantleStatus":{
/*optional, string, tampering status of the access control device: "close"-disabled, "open"-enabled*/
## "@opt":"close,open"
## },
"indicatorLightStatus":{
/*optional, string, indicator status: "offLine"-offline, "onLine"-online*/
"@opt":"offLine,onLine"
## },
"cardReaderOnlineStatus":{
/*optional, array, online status of the authentication unit*/
## "@min": ,
## "@max":
## },
"cardReaderAntiDismantleStatus":{
/*optional, array, tampering status of the authentication unit*/
## "@min": ,
## "@max":
## },
"cardReaderVerifyMode":{
/*optional, array, current authentication mode of the authentication unit: 1-sleep, 2-card+password, 3-card, 4-card or
password, 5-fingerprint, 6-fingerprint+password, 7-fingerprint or card, 8-fingerprint+card, 9-fingerprint+card
+password, 10-face or fingerprint or card or password, 11-face+fingerprint, 12-face+password, 13-face+card, 14-face,
15-employee No.+password, 16-fingerprint or password, 17-employee No.+fingerprint, 18-employee No.+fingerprint
+password, 19-face+fingerprint+card, 20-face+password+fingerprint, 21-employee No.+face, 22-face or face+card, 23-
fingerprint or face, 24-card or face or password, 25-card or face, 26-card or face or fingerprint, 27-card or fingerprint
or password*/
"@opt":"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27"
## },
Intelligent Security API (Access Control on Person) Developer Guide
## 200

"setupAlarmStatus":{
/*optional, array, No. of armed input port*/
## "@min": ,
## "@max":
## },
"alarmInStatus":{
/*optional, array, No. of input port with alarms*/
## "@min": ,
## "@max":
## },
"alarmOutStatus":{
/*optional, array, No. of output port with alarms*/
## "@min": ,
## "@max":
## },
"cardNum":{
/*optional, integer, number of added cards*/
## "@min": ,
## "@max":
## },
"fireAlarmStatus":{
/*optional, string, fire alarm status: "normal", "shortCircuit"-short-circuit alarm, "brokenCircuit"-broken-circuit alarm*/
"@opt":"normal,shortCircuit,brokenCircuit"
## },
"batteryChargeStatus":{
/*optional, string, battery charging status: "charging", "uncharged"*/
## "@opt":"charging,uncharged"
## },
"masterChannelControllerStatus":{
/*optional, string, online status of the master lane controller: "offLine"-offline, "onLine"-online*/
"@opt":"offLine,onLine"
## },
"slaveChannelControllerStatus":{
/*optional, string, online status of the slave lane controller: "offLine"-offline, "onLine"-online*/
"@opt":"offLine,onLine"
## },
"antiSneakServerStatus":{
/*optional, string, anti-passback server status: "disable"-disabled, "normal", "disconnect"-disconnected*/
## "@opt":"disable,normal,disconnect"
## }
## }
## }
6.1.19 JSON_Cap_AlarmInCfg
AlarmInCfg capability message in JSON format
## {
"AlarmInCfg":{
"alarmInNo":{
/*optional, integer, alarm input No.*/
Intelligent Security API (Access Control on Person) Developer Guide
## 201

## "@min": ,
## "@max":
## },
## "name":{
/*optional, string, name*/
## "@min": ,
## "@max":
## },
"detectorType":{
/*optional, integer, detector type: 0-panic switch, 1-magnetic contact, 2-smoke detector, 3-active infrared detector, 4-
passive infrared detector, 5-glass break detector, 6-shock detector, 7-dual technology motion detector, 8-triplex
technology detector, 9-humidity detector, 10-heat detector, 11-gas detector, 12-follow-up switch, 13-control switch,
14-smart lock, 15-water detector, 16-motion detector, 17-open-close detector, 18-wireless single-zone module, 19-
curtain PIR detector, 21-door bell switch, 22-medical help button, 23-outdoor dual technology sensor, 65535-other
detector*/
## "@opt":"0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,65535"
## },
## "type":{
/*optional, integer, zone type: 0-instant alarm zone, 1-24-hour zone, 2-delayed zone, 3-internal zone, 4-key zone, 5-
fire alarm zone, 6-perimeter zone, 7-24-hour silent alarm zone, 8-24-hour auxiliary zone, 9-24-hour shock alarm zone,
10-unlocking all doors zone, 11-locking all doors zone, 12-over-time zone, 13-panic zone, 255-none*/
## "@opt":"0,1,2,3,4,5,6,7,8,9,10,11,12,13,255"
## },
"uploadAlarmRecoveryReport":"true,false",
/*optional, boolean, whether to upload zone alarm recovery report: "true"-yes, "false"-no*/
## "param":{
/*optional, integer, zone parameter, delay time of the delayed zone*/
## "@min": ,
## "@max":
## },
"AlarmTime":{
/*optional, time period of arming*/
## "week":{
"@opt":"Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
/*optional, string, day of the week: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"*/
## },
## "id":{
/*optional, integer, time period No., which is between 1 and 8*/
## "@min":1,
## "@max":8
## },
"beginTime":"",
/*optional, start time of the time period*/
"endTime":""
/*optional, end time of the time period*/
## },
"associateAlarmOut":{
/*optional, array, alarm outputs linked to the alarm input*/
## "@min": ,
## "@max":
## },
"associateSirenOut":{
Intelligent Security API (Access Control on Person) Developer Guide
## 202

/*optional, array, siren outputs linked to the alarm input*/
## "@min": ,
## "@max":
## },
"sensitivityParam":{
/*optional, integer, zone sensitivity parameter: 0-10, 1-250, 2-500, 3-750, unit: millisecond*/
## "@opt":"0,1,2,3"
## },
"arrayBypass":"true,false",
/*optional, boolean, whether to support group bypass: "true"-yes, "false"-no*/
"jointSubSystem":{
/*ro, opt, integer, No. of the partition that the zone belongs to*/
## "@min": ,
## "@max":
## },
"moduleStatus":{
/*optional, string, module status: "onLine"-online, "offLine"-offline*/
"@opt":"onLine,offLine"
## },
"moduleAddress":{
/*optional, integer, module address, the extension module is between 0 and 255, 65535-invalid*/
## "@min":0,
## "@max":255
## },
"moduleChan":{
/*optional, integer, module channel No., which starts from 1, and the maximum value depends on the module type,
## 255-invalid*/
## "@min": ,
## "@max":
## },
"moduleType":{
/*optional, integer, module type: 1-local zone, 2-single zone, 3-dual zone, 4-8 zone, 5-8-channel sensor zone, 6-single-
zone trigger, 7-one-door distributed controller, 8-two-door distributed controller, 9-four-door distributed controller, 10-
eight-zone wireless*/
## "@opt":"1,2,3,4,5,6,7,8,9,10"
## },
## "zone":{
/*ro, opt, integer, zone No.*/
## "@min": ,
## "@max":
## },
"inDelay":{
/*optional, integer, enter delay, which is between 0 and 255, unit: second*/
## "@min":0,
## "@max":255
## },
"outDelay":{
/*optional, integer, exit delay, which is between 0 and 255, unit: second*/
## "@min":0,
## "@max":255
## },
"alarmType":{
Intelligent Security API (Access Control on Person) Developer Guide
## 203

/*optiona, string, alarm device type: "alwaysOpen"-remain open, "alwaysClose"-remain close*/
"@opt":"alwaysOpen,alwaysClose"
## },
"zoneResistor":{
/*optional, integer, zone resistor: 1-2.2, 2-3.3, 3-4.7, 4-5.6, 5-8.2, 255-custom, unit: kilohm*/
## "@opt":"1,2,3,4,5,255"
## },
"zoneResistorManual":{
/*optional, float type, zone resistor set manually, which is between 1.0 and 10.0 and is accurate to one decimal place.
This field is valid when zoneResistor is 255*/
## "@min": ,
## "@max":
## },
"detectorSerialNo":{
/*ro, opt, string, detector serial No.*/
## "@min": ,
## "@max":
## },
"zoneSignalType":{
/*ro, opt, string, transmission type of zone signal: "wiredArea"-wired zone, "wirelessZone"-wireless zone*/
"@opt":"wiredArea,wirelessArea"
## },
"disableDetectorTypeCfg":"true,false",
/*optional, boolean, whether to enable configuring detector type: "true"-yes, "false"-no*/
"timeOutRange":{
/*optional, integer, timeout range: 0-ranging from 1 to 599, 1-ranging from 1 to 65535, unit: second*/
## "@opt":"0,1"
## },
"associateLampOut":{
/*optional, array, alarm lamp output*/
## "@min": ,
## "@max":
## },
"timeOut":{
/*optional, integer, timeout, unit: second*/
## "@min": ,
## "@max":
## },
"detectorSignalIntensity":{
/*ro, opt, integer, detector signal strength, which is between 0 and 100*/
## "@min": ,
## "@max":
## },
"timeOutMethod":{
/*optional, string, timing type of the over-time zone: "trigger"-trigger timing, "resume"-reset timing*/
## "@opt":""
## }
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 204

6.1.20 JSON_Cap_AlarmOutCfg
AlarmOutCfg capability message in JSON format
## {
"AlarmOutCfg":{
"maxSize": ,
/*optional, integer, maximum number of alarm outputs that can be configured in a batch*/
"alarmOutNo":{
/*optional, integer, alarm output No.*/
## "@min": ,
## "@max":
## },
## "name":{
/*optional, string, name*/
## "@min": ,
## "@max":
## },
## "delay":{
/*optional, integer, output delay, which is between 0 and 3599, 0 refers to continuous output, unit: second*/
## "@min":0,
## "@max":3599
## },
"triggerIndex":{
/*ro, opt, integer, trigger No.*/
## "@min": ,
## "@max":
## },
"associateAlarmIn":{
/*optional, array, alarm input channel followed by the siren (multiple alarm inputs trigger the same siren output
simultaneously)*/
## "@min": ,
## "@max":
## },
"moduleType":{
/*optional, integer, external trigger type: 1-local trigger, 2-4-channel trigger, 3-8-channel trigger, 4-single-zone trigger,
5-32-channel trigger, 6-1-door distributed controller, 7-2-door distributed controller, 8-4-door distributed controller,
9-2-channel trigger*/
## "@opt":"1,2,3,4,5,6,7,8,9"
## },
"moduleStatus":{
/*optional, string, external trigger status: "onLine"-online, "offLine"-offline*/
"@opt":"onLine,offLine"
## },
"moduleAddress":{
/*optional, integer, external trigger address, the extension module is between 0 and 255, 65535-invalid*/
## "@min":0,
## "@max":255
## },
"moduleChan":{
/*optional, integer, external trigger channel No., which starts from 1, the maximum value depends on the module
Intelligent Security API (Access Control on Person) Developer Guide
## 205

type, 255-invalid*/
## "@min": ,
## "@max":
## },
"workMode":{
/*optionao, string, working mode: "linkage", "followUp"-follow-up*/
"@opt":"linkage,followUp"
## },
"alarmOutMode":{
/*optional, string, output mode: "nonPluse"-non-pulse mode, "pluse"-pulse mode*/
"@opt":"nonPluse,pluse"
## },
"timeOn":{
/*optional, integer, open duration, which is between 1 and 60, unit: second*/
## "@min":1,
## "@max":60
## },
"timeOff":{
/*optional, integer, close duration, which is between 1 and 60, unit: second*/
## "@min":1,
## "@max":60
## }
## }
## }
## 6.1.21
JSON_Cap_AntiSneakCfg
AntiSneakCfg capability message in JSON format
## {
"AntiSneakCfg": {
## "enable": "true,false",
/*required, boolean, whether to enable anti-passing back*/
"startCardReaderNo": {
/*optional, integer, first card reader No., 0-no first card reader*/
## "@min": 1,
## "@max": 4
## }
## }
## }
## 6.1.22
JSON_Cap_AttendanceStatusModeCfg
AttendanceStatusModeCfg capability message in JSON format
## {
"AttendanceStatusModeCfg":{
## "mode":{
/*optional, string type, attendance mode: "disable", "manual", "auto"-automatic, "manualAndAuto"-manual and
Intelligent Security API (Access Control on Person) Developer Guide
## 206

automatic*/
"@opt":"disable,manual,auto,manualAndAuto"
## },
"manualStatusTime":{
/*optional, integer type, duration of manual attendance status, unit: second. This node is valid when mode is
"manual" or "manualAndAuto"*/
## "@min":5,
## "@max":999
## },
"attendanceStatusEnable":"true,false"
/*optional, boolean type, whether to enable attendance status: "true"-yes (if the device has not been configured with
start time and end time of the automatic attendance mode, the user will be prompted to select the attendance
status), "false"-no (if the device has not been configured with start time and end time of the automatic attendance
mode, there will be no prompt)*/
## }
## }
## 6.1.23
JSON_Cap_AttendanceStatusRuleCfg
AttendanceStatusRuleCfg capability message in JSON format
## {
"AttendanceStatusRuleCfg":{
"statusKey":{
/*optional, string type, status shortcut key: "Up", "Down", "Left", "Right", "ESC", "OK", "notConfig". If this node is not
configured, this node will be set to "notConfig" by default*/
"@opt":"Up,Down,Left,Right,ESC,OK"
## },
"attendanceStatus":{
/*optional, string type, attendance status: "undefined", "checkIn"-check in, "checkOut"-check out, "breakOut"-break
out, "breakIn"-break in, "overtimeIn"-overtime in, "overTimeOut"-overtime out*/
"@opt":"undefined,checkIn,checkOut,breakOut,breakIn,overtimeIn,overtimeOut"
## },
"statusValue":{
/*optional, integer type, status value*/
## "@min":0,
## "@max":255
## },
"WeekPlanCfg":{
## /*schedule*/
"maxSize":7,
## "week":{
"@opt":"Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
## },
"beginTime":"",
/*start time*/
"timeValid":"minute"
/*time accuracy: "day", "hour", "minute", "second"*/
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 207

## }
## }
6.1.24 JSON_Cap_CardInfo
CardInfo capability message in JSON format
## {
"CardInfo":{
"supportFunction":{
/*required, supported functions of adding, editing, deleting, searching for card information, and getting the total
number of added cards: "post"-add, "delete", "put"-edit, "get"-search, "setUp"-set*/
"@opt":"post,delete,put,get,setUp"
## },
"CardInfoSearchCond":{
/*optional, search conditions*/
"searchID":{
/*required, string type, search ID, which is used to check the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
## "@min":1,
## "@max":36
## },
"maxResults":{
/*required, integer32, maximum number of obtained records*/
## "@min":1,
## "@max":30
## },
"EmployeeNoList":{
/*optional, person ID list*/
"maxSize":56,
"employeeNo":{
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## }
## },
"CardNoList":{
/*optional, card No. list*/
"maxSize":56,
"cardNo":{
/*optional, string, card No.*/
## "@min":1,
## "@max":32
## }
## }
## },
"CardInfoDelCond":{
/*optional, deleting conditions*/
"EmployeeNoList":{
/*optional, person ID list*/
Intelligent Security API (Access Control on Person) Developer Guide
## 208

"maxSize":56,
"employeeNo":{
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## }
## },
"CardNoList":{
/*optional, card No. list*/
"maxSize":56,
"cardNo":{
/*optional, string, card No.*/
## "@min":1,
## "@max":32
## }
## }
## },
"cardNo":{
/*required, string, card No.*/
## "@min":1,
## "@max":32
## },
"employeeNo":{
/*required, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## },
"cardType":{
/*required, string, card type: "normalCard"-normal card, "patrolCard"-patrol card, "hijackCard"-duress card,
"superCard"-super card, "dismissingCard"-dismiss card, "emergencyCard"-emergency card (it is used to assign
permission to a temporary card, but it cannot open the door)*/
"@opt":"normalCard,patrolCard,hijackCard,superCard,dismissingCard,emergencyCard"
## },
"leaderCard":{
/*optional, string, whether to support first card authentication function*/
## "@min":1,
## "@max":32
## },
"checkCardNo":"true,false",
/*optional, boolean, whether to enable duplicated card verification: "false"-disable, "true"-enable. If this node is not
configured, the device will verify the duplicated card by default. When there is no card information, you can set
checkCardNo to "false" to speed up data applying; otherwise, it is not recommended to configure this node*/
"checkEmployeeNo":"true,false",
/*optional, boolean, whether to check the existence of the employee No. (person ID): "false"-no, "true"-yes. If this
node is not configured, the device will judge the existence of the employee No. (person ID) by default. If this node is
set to "false", the device will not judge the existence of the employee No. (person ID) to speed up data applying; if this
node is set to "true" or NULL, the device will judge the existence of the employee No. (person ID), and it is
recommended to set this node to "true" or NULL if there is no need to speed up data applying*/
"addCard":"true,false",
/*optional, boolean type, whether to add the card if the card information being edited does not exist: "false"-no (if
the device has checked that the card information being edited does not exist, the failure response message will be
returned along with the error code), "true"-yes (if the device has checked that the card information being edited does
Intelligent Security API (Access Control on Person) Developer Guide
## 209

not exist, the success response message will be returned, and the card will be added). If this node is not configured,
the card will not be added by default*/
"maxRecordNum":
/*required, integer type, supported maximum number of records (card records)*/
## }
## }
6.1.25 JSON_Cap_CardReaderAntiSneakCfg
CardReaderAntiSneakCfg capability message in JSON format
## {
"CardReaderAntiSneakCfg": {
"cardReaderNo": {
/optional, string, card reader No.*/
## "@min": ,
## "@max":
## }
## "enable": "true,false",
/*equired, boolean, whether to enable the
anti-passing back function of the card reader: "true"-enable, "false"-
disable*/
"followUpCardReader": {
/*optional, array, following card reader No. after the first card reader*/
## "@min": ,
## "@max":
## }
## }
## }
6.1.26 JSON_Cap_CardReaderCfg
CardReaderCfg capability message in JSON format
## {
"CardReaderCfg":{
"cardReaderNo":{
/*optional, integer, card reader No.*/
## "@min": ,
## "@max":
## },
## "enable":"true,false",
/*required, boolean, whether to enable: "true"-yes, "false"-no*/
"okLedPolarity":{
/*optional, string, OK LED polarity: "cathode", "anode"*/
## "@opt":"cathode,anode"
## },
"errorLedPolarity":{
/*optional, string, error LED polarity: "cathode", "anode"*/
## "@opt":"cathode,anode"
Intelligent Security API (Access Control on Person) Developer Guide
## 210

## },
"buzzerPolarity":{
/*optional, string, buzzer polarity: "cathode", "anode"*/
## "@opt":"cathode,anode"
## },
"swipeInterval":{
/*optional, integer, time interval of repeated authentication, which is valid for authentication modes such as
fingerprint, card, face, etc., unit: second*/
## "@min":1,
## "@max":255
## },
"pressTimeout":{
/*optional, integer, timeout to reset entry on keypad, unit: second*/
## "@min":1,
## "@max":255
## },
"enableFailAlarm":"true,false",
/*optional, boolean, whether to enable excessive failed authentication attempts alarm*/
"maxReadCardFailNum":{
/*optional, integer, maximum number of failed authentication attempts*/
## "@min":1,
## "@max":255
## },
"enableTamperCheck":"true,false",
/*optional, boolean, whether to enable tampering detection*/
"offlineCheckTime":{
/*optional, integer, time to detect after the card reader is offline, unit: second*/
## "@min":1,
## "@max":255
## },
"fingerPrintCheckLevel":{
/*optional, integer, fingerprint recognition level: 1-1/10 false acceptance rate (FAR), 2-1/100 false acceptance rate
(FAR), 3-1/1000 false acceptance rate (FAR), 4-1/10000 false acceptance rate (FAR), 5-1/100000 false acceptance rate
(FAR), 6-1/1000000 false acceptance rate (FAR), 7-1/10000000 false acceptance rate (FAR), 8-1/100000000 false
acceptance rate (FAR), 9-3/100 false acceptance rate (FAR), 10-3/1000 false acceptance rate (FAR), 11-3/10000 false
acceptance rate (FAR), 12-3/100000 false acceptance rate (FAR), 13-3/1000000 false acceptance rate (FAR),
14-3/10000000 false acceptance rate (FAR), 15-3/100000000 false acceptance rate (FAR), 16-Automatic Normal, 17-
Automatic Secure, 18-Automatic More Secure (currently not support)*/
## "@opt":"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18"
## },
"useLocalController":"true,false",
/*ro, opt, boolean, whether it is connected to the distributed controller*/
"localControllerID":{
/*ro, opt, integer, distributed controller No., which is between 1 and 64, 0-unregistered. This field is valid only when
useLocalController is "true"*/
## "@min":0,
## "@max":64
## },
"localControllerReaderID":{
/*ro, opt, integer, card reader ID of the distributed controller, 0-unregistered. This field is valid only when
useLocalController is "true"*/
## "@min":0,
Intelligent Security API (Access Control on Person) Developer Guide
## 211

## "@max":4
## },
"cardReaderChannel":{
/*ro, opt, integer, communication channel No. of the card reader: 0-Wiegand or offline, 1-RS-485A, 2-RS-485B. This
field is valid only when useLocalController is "true"*/
## "@opt":"0,1,2"
## },
"fingerPrintImageQuality":{
/*opt, integer, fingerprint image quality: 1-low quality (V1), 2-medium quality (V1), 3-high quality (V1), 4-highest
quality (V1), 5-low quality (V2), 6-medium quality (V2), 7-high quality (V2), 8-highest quality (V2)*/
## "@opt":"1,2,3,4,5,6,7,8"
## },
"fingerPrintContrastTimeOut":{
/*optional, integer, fingerprint comparison timeout, which is between 1 and 20, unit: second, 255-infinite*/
## "@min":0,
## "@max":20
## },
"fingerPrintRecogizeInterval":{
/*optional, integer, fingerprint scanning interval, which is between 1 and 10, unit: second, 255-no delay*/
## "@min":0,
## "@max":10
## },
"fingerPrintMatchFastMode":{
/*optional, integer, fingerprint matching quick mode: 1-quick mode 1, 2-quick mode 2, 3-quick mode 3, 4-quick mode
4, 5-quick mode 5, 255-automatic*/
## "@min":0,
## "@max":5
## },
"fingerPrintModuleSensitive":{
/*optional, integer, fingerprint module sensitivity, which is between 1 and 8*/
## "@min":1,
## "@max":8
## },
"fingerPrintModuleLightCondition":{
/*optional, string, fingerprint module light condition: "outdoor", "indoor"*/
## "@opt":"outdoor,indoor"
## },
"faceMatchThresholdN":{
/*optional, integer, threshold of face picture 1:N comparison, which is between 0 and 100*/
## "@min":0,
## "@max":100
## },
"faceQuality":{
/*optional, integer, face picture quality, which is between 0 and 100*/
## "@min":0,
## "@max":100
## },
"faceRecogizeTimeOut":{
/*optional, integer, face recognition timeout, which is between 1 and 20, unit: second, 255-infinite*/
## "@min":0,
## "@max":20
## },
Intelligent Security API (Access Control on Person) Developer Guide
## 212

"faceRecogizeInterval":{
/*optional, integer, face recognition interval, which is between 1 and 10, unit: second, 255-no delay*/
## "@min":0,
## "@max":10
## },
"cardReaderFunction":{
/*ro, opt, array, card reader type: "fingerPrint"-fingerprint, "face", "fingerVein"-finger vein*/
"@opt":"fingerPrint,face,fingerVein"
## },
"cardReaderDescription":{
/*ro, opt, card reader description. If the card reader is the Wiegand card reader or if offline, this field will be set to
"Wiegand" or "485Offline"*/
## "@min":1,
## "@max":16
## },
"faceImageSensitometry":{
/*ro, opt, integer, face picture exposure, which is between 0 and 65535*/
## "@min":0,
## "@max":65535
## },
"livingBodyDetect":"true,false",
/*optional, boolean, whether to enable human detection*/
"faceMatchThreshold1":{
/*optional, integer, threshold of face picture 1:1 comparison, which is between 0 and 100*/
## "@min":0,
## "@max":100
## },
"buzzerTime":{
/*optional, integer, buzzing duration, which is between 0 and 5999, unit: second, 0-long buzzing*/
## "@min":0,
## "@max":5999
## },
"faceMatch1SecurityLevel":{
/*optional, integer, security level of face 1:1 recognition: 1-normal, 2-high, 3-higher*/
## "@opt":"1,2,3"
## },
"faceMatchNSecurityLevel":{
/*optional, integer, security level of face 1:N recognition: 1-normal, 2-high, 3-higher*/
## "@opt":"1,2,3"
## },
"envirMode":{
/*optional, string, environment mode of face recognition: "indoor", "other"*/
## "@opt":"indoor,other"
## },
"liveDetLevelSet":{
/*optional, string, threshold level of liveness detection: "low", "middle"-medium, "high"*/
## "@opt":"low,middle,high"
## },
"liveDetAntiAttackCntLimit":{
/*optional, integer, number of anti-attacks of liveness detection, which is between 1 and 255. This value should be
configured as the same one on both client and device*/
## "@min":1,
Intelligent Security API (Access Control on Person) Developer Guide
## 213

## "@max":255
## },
"enableLiveDetAntiAttack":"true,false",
/*optional, boolean, whether to enable anti-attack for liveness detection*/
"supportDelFPByID":"true,false",
/*ro, opt, boolean, whether the card reader supports deleting fingerprint by fingerprint ID: "true"-yes, "false"-no*/
"fingerPrintCapacity":{
/*ro, opt, integer, maximum number of fingerprints that can be added*/
## "@min": ,
## "@max":
## },
"fingerPrintNum":{
/*ro, opt, integer, number of added fingerprints*/
## "@min": ,
## "@max":
## },
"defaultVerifyMode":{
/*ro, opt, string, default authentication mode of the card reader (factory defaults): "cardAndPw"-card+password,
"card", "cardOrPw"-card or password, "fp"-fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or
card, "fpAndCard"-fingerprint+card, "fpAndCardAndPw"-fingerprint+card+password, "faceOrFpOrCardOrPw"-face or
fingerprint or card or password, "faceAndFp"-face+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face
+card, "face", "employeeNoAndPw"-employee No.+password, "fpOrPw"-fingerprint or password,
"employeeNoAndFp"-employee No.+fingerprint, "employeeNoAndFpAndPw"-employee No.+fingerprint+password,
"faceAndFpAndCard"-face+fingerprint+card, "faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-
employee No.+face, "faceOrfaceAndCard"-face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or
face or password, "cardOrFace"-card or face, "cardOrFaceOrFp"-card or face or fingerprint*/

"@opt":"cardAndPw,card,cardOrPw,fp,fpAndPw,fpOrCard,fpAndCard,fpAndCardAndPw,faceOrFpOrCardOrPw,faceAnd
Fp,faceAndPw,faceAndCard,face,employeeNoAndPw,fpOrPw,employeeNoAndFp,employeeNoAndFpAndPw,faceAndFp
AndCard,faceAndPwAndFp,employeeNoAndFace,faceOrfaceAndCard,fpOrface,cardOrfaceOrPw,cardOrFace,cardOrFac
eOrFp"
## },
"faceRecogizeEnable":{
/*optional, integer, whether to enable facial recognition: 1-enable, 2-disable, 3-attendence checked in/out by
recognition of multiple faces*/
## "@opt": "1,2,3"
## },
"FPAlgorithmVersion":{
/*optional, string, read-only, fingerprint algorithm library version*/
## "@min": ,
## "@max":
## },
"cardReaderVersion":{
/*optional, string, read-only, card reader version*/
## "@min": ,
## "@max":
## }
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 214

6.1.27 JSON_Cap_CardReaderPlan
CardReaderPlan capability message in JSON format
## {
"CardReaderPlan": {
"cardReaderNo ": {
/*authentication unit (card reader, fingerprint module, etc.) No.*/
## "@min": 1,
## "@max": 4
## },
"templateNo": {
/required, integer, schedule template No.: 0-cancel linking the template to the schedule and restore to the default
status (normal status)*/
## "@min": 1,
## "@max": 16
## }
## }
## }
## 6.1.28
JSON_Cap_ClearAntiSneak
ClearAntiSneak capability message in JSON format
## {
"ClearAntiSneak": {
"clearAll": "true,false",
/*required, boolean, whether to clear all anti-passing back records: "true"-yes, "false"-no. Clearing all anti-passing
back records is not supported by access control devices version 2.1*/
"EmployeeNoList" : {
/*optional, person ID list, this node is valid when clearAll is "false"*/
"maxSize": ,
"employeeNo": {
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## }
## }
## }
## }
## 6.1.29
JSON_Cap_ClearAntiSneakCfg
ClearAntiSneakCfg capability message in JSON format
## {
"ClearAntiSneakCfg": {
"ClearFlags": {
Intelligent Security API (Access Control on Person) Developer Guide
## 215

"antiSneak": "true,false"
/*required, boolean, whether to clear the anti-passing back parameter*/
## }
## }
## }
6.1.30 JSON_Cap_ClearEventCardLinkageCfg
ClearEventCardLinkageCfg capability message in JSON format
## {
"ClearEventCardLinkageCfg": {
"ClearFlags": {
"eventCardLinkage": "true,false"
/*required, boolean, whether to clear event and card linkage parameters: "true"-yes, "false"-no*/
## }
## }
## }
6.1.31 JSON_Cap_ClearGroupCfg
ClearGroupCfg capability message in JSON format
## {
"ClearGroupCfg":{
"ClearFlags":{
"groupCfg":"true,false"
/*required, boolean, group parameters*/
## }
## }
## }
6.1.32 JSON_Cap_ClearPlansCfg
ClearPlansCfg capability message in JSON format
## {
"ClearPlansCfg":{
"ClearFlags":{
"doorStatusWeekPlan": "true,false",
/*optional, boolean, whether to clear the week schedule of the door control*/
"cardReaderWeekPlan": "true,false",
/*optional, boolean, whether to clear the week schedule of the card reader authentication mode control*/
"userRightWeekPlan": "true,false",
/*optional, boolean, whether to clear the week schedule of the access permission control*/
"doorStatusHolidayPlan": "true,false",
/*optional, boolean, whether to clear the holiday schedule of the door control*/
Intelligent Security API (Access Control on Person) Developer Guide
## 216

"cardReaderHolidayPlan": "true,false",
/*optional, boolean, whether to clear the holiday schedule of the card reader authentication mode control*/
"userRightHolidayPlan": "true,false",
/*optional, boolean, whether to clear the holiday schedule of the access permission control*/
"doorStatusHolidayGroup": "true,false",
/*optional, boolean, whether to clear the holiday group of the door control*/
"cardReaderHolidayGroup": "true,false",
/*optional, boolean, whether to clear the holiday group of the card reader authentication mode control*/
"userRightHolidayGroup": "true,false",
/*optional, boolean, whether to clear the holiday group of the access permission control*/
"doorStatusTemplate": "true,false",
/*optional, boolean, whether to clear the schedule template of the door control*/
"cardReaderTemplate": "true,false",
/*optional, boolean, whether to clear the control schedule template of the card reader authentication mode*/
"userRightTemplate": "true,false"
/*optional, boolean, whether to clear the schedule template of the access permission control*/
## }
## }
## }
6.1.33 JSON_Cap_ControlAlarmChan
ControlAlarmChan capability message in JSON format
## {
"ControlAlarmChan":{
"assiciateAlarmIn":{
/*require, array, zone channels and status: 0-disarm, 1-arm*/
## "@opt":"0,1"
## }
## }
## }
6.1.34 JSON_Cap_DoorStatusHolidayGroupCfg
DoorStatusHolidayGroupCfg capability message in JSON format
## {
"DoorStatusHolidayGroupCfg": {
"groupNo": {
/*holiday group No.*/
## "@min": 1,
## "@max": 16
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"groupName": {
/*holiday group name*/
## "@min": 1,
Intelligent Security API (Access Control on Person) Developer Guide
## 217

## "@max": 32
## },
"holidayPlanNo" : {
/*holiday group schedule No.*/
## "@min": 1,
## "@max": 16
## }
## }
## }
6.1.35 JSON_Cap_DoorStatusHolidayPlanCfg
DoorStatusHolidayPlanCfg capability message in JSON format
## {
"DoorStatusHolidayPlanCfg": {
"planNo": {
/*holiday schedule No.*/
## "@min": 1,
## "@max": 16
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"beginDate": "",
/*start date of the holiday*/
"endDate": "",
/*end date of the holiday*/
"HolidayPlanCfg" : {
/*holiday schedule parameters*/
"maxSize": 8,
## "id": {
/*time period No.*/
## "@min": 1,
## "@max": 8
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"doorStatus": {
/*door status: "remainOpen"-remain open (access without authentication), "remainClosed"-remain closed (access is
not allowed), "normal"-access by authentication, "sleep", "invalid"*/
"@opt": "remainOpen,remainClosed,normal,sleep,invalid"
## },
"TimeSegment": {
"beginTime": "",
/*start time of the time period (device local time)*/
"endTime": "",
/*end time of the time period (device local time)*/
"validUnit":
/*time accuracy: "hour", "minute", "second". If this node is not returned, it indicates that the time accuracy is
## "minute"*/
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 218

## }
## }
## }
6.1.36 JSON_Cap_DoorStatusPlan
DoorStatusPlan capability message in JSON format
## {
"DoorStatusPlan": {
"doorNo": {
## /*door No.*/
## "@min": 1,
## "@max": 4
## },
"templateNo": {
/*required, integer, schedule template No.: 0-cancel linking the template with the schedule and restore to the default
status (normal status)*/
## "@min": 1,
## "@max": 16
## }
## }
## }
6.1.37 JSON_Cap_DoorStatusPlanTemplate
DoorStatusPlanTemplate capability message in JSON format
## {
"DoorStatusPlanTemplate": {
"templateNo ": {
/*schedule template No.*/
## "@min": 1,
## "@max": 16
## },
## "enable": "true,false",
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"templateName": {
/*required, string, template name*/
## "@min": 1,
## "@max": 32
## },
"weekPlanNo":{
/*required, integer, week schedule No.*/
## "@min": 1,
## "@max": 16
## },
"holidayGroupNo" : {
/*required, integer, holiday group No.*/
Intelligent Security API (Access Control on Person) Developer Guide
## 219

## "@min": 1,
## "@max": 16
## }
## }
## }
6.1.38 JSON_Cap_DoorStatusWeekPlanCfg
DoorStatusWeekPlanCfg capability message in JSON format
## {
"DoorStatusWeekPlanCfg":{
"planNo":{
/*week schedule No.*/
## "@min":1,
## "@max":16
## },
## "enable":"true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"WeekPlanCfg":{
/*week schedule parameters*/
"maxSize":56,
## "week":{
"@opt":"Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
## },
## "id":{
## "@min":1,
## "@max":8
## },
## "enable":"true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"doorStatus":{
/*door status: "remainOpen"-remain open (access without
authentication), "remainClosed"-remain closed (access is
not allowed), "normal"-access by authentication, "sleep", "invalid"*/
"@opt":"remainOpen,remainClosed,normal,sleep,invalid"
## },
"TimeSegment":{
"beginTime":"",
/*start time of the time period (device local time)*/
"endTime":"",
/*end time of the time period (device local time)*/
"validUnit":
/*time accuracy: "hour", "minute", "second". If this node is not returned, it indicates that the time accuracy is
## "minute"*/
## }
## }
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 220

6.1.39 JSON_Cap_EventCardLinkageCfg
EventCardLinkageCfg capability message in JSON format
## {
"EventCardLinkageCfg":{
"eventID":{
/*optional, integer, event ID*/
## "@min": ,
## "@max":
## },
"proMode":{
/*required, string, linkage type: "event"-event linkage, "card"-card linkage, "mac"-MAC address linkage, "employee"-
employee No. (person ID)*/
## "@opt": "event,card,mac,employee"
## },
"EventLinkageInfo":{
/*optional, event linkage parameters, it is valid when proMode is "event"*/
"mainEventType":{
/*optional, integer, major event type: 0-device event, 1-alarm input event, 2-access control point event, 3-
authentication
unit (card reader, fingerprint module) event*/
## "@opt": "0,1,2,3"
## },
"devSubEventType":{
/*optional, integer, minor type of device event, refer to Event Linkage Types for details*/
## "@opt": "0,1,2,3..."
## },
"alarmSubEventType": {
/*optional, integer, minor type of alarm input event, refer to Event Linkage Types for details*/
## "@opt": "0,1,2,3..."
## },
"doorSubEventType": {
/*optional, integer, minor type of access control point event, refer to Event Linkage Types for details*/
## "@opt": "0,1,2,3..."
## },
"cardReaderSubEventType":{
/*optional, integer, minor type of authentication unit event, refer to Event Linkage Types for details*/
## "@opt": "0,1,2,3..."
## }
## },
"CardNoLinkageInfo":{
/*optional, card linkage parameters, it is valid when proMode is "card"*/
"cardNo":{
/*optional, string, card No.*/
## "@min": ,
## "@max":
## }
## },
"MacAddrLinkageInfo":{
/*optional, MAC address linkage parameters, it is valid when proMode is "mac"*/
"MACAddr":{
Intelligent Security API (Access Control on Person) Developer Guide
## 221

/*optional, string, physical MAC address*/
## "@min": ,
## "@max":
## }
## },
"EmployeeInfo":{
/*optional, employee No. (person ID) linkage parameters, it is valid when proMode is "employee"*/
"employeeNo":{
/*optional, string, employee ID (person ID)*/
## "@min": ,
## "@max":
## }
## },
"eventSourceID":{
/*optional, integer, event source ID, it is valid when proMode is "event", 65535-all. For device event (mainEventType
is 0), this field is invalid; for access control point event (mainEventType is 2), this field refers to the access control
point No.; for authentication unit event (mainEventType is 3, this field refers to the authentication unit No.; for alarm
input event (mainEventType is 1), this field refers to the zone alarm input ID or the event alarm input ID*/
## "@min": ,
## "@max":
## },
## "alarmout":{
/*optional, array, linked alarm output No.*/
## "@min": ,
## "@max":
## },
"openDoor":{
/*optional, array, linked door No. to open*/
## "@min": ,
## "@max":
## },
"closeDoor":{
/*optional, array, linked door No. to close*/
## "@min": ,
## "@max":
## },
"alwaysOpen":{
/*optional, array, linked door No. to remain unlocked*/
## "@min": ,
## "@max":
## },
"alwaysClose":{
/*optional, array, linked door No. to remain locked*/
## "@min": ,
## "@max":
## },
"mainDevBuzzer": "true,false",
/*optional, boolean, whether to enable buzzer linkage of the access controller (start buzzing): "false"-no, "true"-yes*/
"capturePic": "true,false",
/*optional, boolean, whether to enable capture linkage: "false"-no, "true"-yes*/
"recordVideo": "true,false",
/*optional, boolean, whether to enable recording linkage: "false"-no, "true"-yes*/
Intelligent Security API (Access Control on Person) Developer Guide
## 222

"mainDevStopBuzzer": "true,false",
/*optional, boolean, whether to enable buzzer linkage of the access controller (stop buzzing): "false"-no, "true"-yes*/
"audioDisplayID": {
/*optional, integer, linked audio announcement ID, which is between 1 and 32: 0-not link*/
## "@min": ,
## "@max":
## },
"audioDisplayMode": {
/*optional, integer, linked audio announcement mode: "close", "single", "loop"*/
## "@min": "close,single,loop"
## },
"readerBuzzer": {
/*optional, array, linked buzzer No.*/
## "@min": ,
## "@max":
## },
"alarmOutClose": {
/*optional, array, linked alarm output No.*/
## "@min": ,
## "@max":
## },
"alarmInSetup": {
/*optional, array, linked zone No. to arm*/
## "@min": ,
## "@max":
## },
"alarmInClose": {
/*optional, array, linked zone No. to disarm*/
## "@min": ,
## "@max":
## },
"readerStopBuzzer": {
/*optional, array, linked buzzer No. to stop buzzing*/
## "@min": ,
## "@max":
## }，
"purePwdVerifyEnable":
/*optional, boolean, whether the device supports opening the door only by password: true-yes, this node is not
returned-no. The password used to open the door is the value of the node password in the message JSON_UserInfo.*/
/*For opening the door only by password: 1. The password in "XXX or password" in the authentication mode refers to
the person's password (the value of the node password in JSON_UserInfo); 2. The device will not check the
duplication of the password, and the upper platform should ensure that the password is unique; 3. The password
cannot be added, deleted, edited, or searched for on the device locally.*/
## }
## }
## See Also
## Event Linkage Types
Intelligent Security API (Access Control on Person) Developer Guide
## 223

6.1.40 JSON_Cap_EventCardNoList
EventCardNoList capability message in JSON format
## {
"EventCardNoList":{
## "id":{
/*optional, range of event ID that can be configured*/
## "@min": ,
## "@max":
## }
## }
## }
## 6.1.41
JSON_Cap_EventOptimizationCfg
EventOptimizationCfg capability message in JSON format
## {
"EventOptimizationCfg":{
## "enable":"true,false",
/*optional, boolean, whether to enable event optimization: "true"-yes (default), "false"-no*/
"isCombinedLinkageEvents": "true,false"
/*optional, boolean, whether to enable linked event combination: "true"-yes (default), "false"-no*/
## }
## }
6.1.42 JSON_Cap_FaceRecognizeMode
FaceRecognizeMode capability message in JSON format
## {
"FaceRecognizeMode":{
## "mode":{
/*optional, string type, facial recognition mode: "normalMode"-normal mode, "deepMode"-deep mode*/
"@opt":"normalMode,deepMode"
## }
## }
## }
6.1.43 JSON_Cap_FingerPrintCfg
FingerPrintCfg capability message in JSON format
## {
"FingerPrintCfg":{
Intelligent Security API (Access Control on Person) Developer Guide
## 224

"searchID":{
/*required, string type, search ID*/
## "@min":1,
## "@max":36
## },
"employeeNo":{
/*required, string, employee No. (person ID) linked with the fingerprint*/
## "@min": ,
## "@max":
## },
"enableCardReader":{
/*required, array, fingerprint module to apply fingerprint data to*/
## "@min": ,
## "@max":
## },
"fingerPrintID":{
/*required, integer, fingerprint No., which is between 1 and 10*/
## "@min":1,
## "@max":10
## },
"fingerType":{
/*required, string, fingerprint type: "normalFP"-normal fingerprint, "hijackFP"-duress fingerprint, "patrolFP"-patrol
fingerprint, "superFP"-super fingerprint, "dismissingFP"-dismiss fingerprint*/
"@opt":"normalFP,hijackFP,patrolFP,superFP,dismissingFP"
## },
"leaderFP":{
/*optional, array, whether to support first time authentication function*/
## "@min":1,
## "@max":32
## },
"checkEmployeeNo":"true,false",
/*optional, boolean, whether to judge the existence of the employee No. (person ID): "false"-no, "true"-yes. If this
node is not configured, the device will judge the existence of the employee No. (person ID) by default. If this node is
set to "false", the device will not judge the existence of the employee No. (person ID) to speed up data applying; if this
node is set to "true" or NULL, the device will judge the existence of the employee No. (person ID), and it is
recommended to set this node to "true" or NULL if there is no need to speed up data applying*/
"callbackMode":"allRetrun,partReturn",
/*optional, string, device callback mode: "allRetrun"-return when applying to all fingerprint modules completed
(blocking); "partReturn"-return when applying to a part of fingerprint modules completed (unblocking). If this node is
set to NULL, blocking mode will be adopted*/
/*when blocking mode is adopted, the totalStatus must be 1 after FingerPrintStatus is returned, which indicates that
the fingerprint information is applied; when unblocking mode is adopted, if the totalStatus is 0 after FingerPrintStatus
is returned, you should repeatedly call the URI /ISAPI/AccessControl/FingerPrintProgress?format=json to get the
applying progress (which is also returned in FingerPrintStatus) until totalStatus equals to 1 (the fingerprint
information is applied)*/
"StatusList":{
/*optional, status list*/
## "id":{
/*optional, integer, fingerprint module No.*/
## "@min": ,
## "@max":
## },
Intelligent Security API (Access Control on Person) Developer Guide
## 225

"cardReaderRecvStatus":{
/*optional, integer, fingerprint module status: 0-connecting failed, 1-connected, 2-the fingerprint module is offline, 3-
the fingerprint quality is poor, try again, 4-the memory is full, 5-the fingerprint already exists, 6-the fingerprint ID
already exists, 7-invalid fingerprint ID, 8-this fingerprint module is already configured, 10-the fingerprint module
version is too old to support the employee No.*/
## "@opt": "0,1,2,3,4,5,6,7,8,10"
## },
"errorMsg":{
/*optional, string, error information*/
## "@min": ,
## "@max":
## }
## },
"totalStatus":{
/*required, integer, applying status: 0-applying, 1-applied*/
## "@opt":"0,1"
## },
"isSupportFingerCover":true,
/*whether to support overwriting the original fingerprint when applying new fingerprint linked with the same person
ID or employee No. If it is supported, this node will be set to "true"; otherwise, this node will not be returned*/
"isSupportSetUp":true
/*whether to support setting fingerprint parameters. If it is supported, this node will be set to "true"; otherwise, this
node will not be returned*/
## }
## }
6.1.44 JSON_Cap_FingerPrintDelete
FingerPrintDelete capability message in JSON format
## {
"FingerPrintDelete":{
## "mode":{
/*required, string, deleting mode: "byEmployeeNo"-delete by employee No. (person ID), "byCardReader"-delete by
fingerprint module*/
"@opt":"byEmployeeNo,byCardReader"
## },
"EmployeeNoDetail":{
/*optional, delete by employee No. (person ID), this node is valid when mode is "byEmployeeNo"*/
"employeeNo":{
/*optional, string, employee No. (person ID) linked with the fingerprint*/
## "@min": ,
## "@max":
## },
"enableCardReader":{
/*optional, array, fingerprint module whose fingerprints should be deleted*/
## "@min": ,
## "@max":
## },
"fingerPrintID":{
/*optional, array, No. of fingerprint to be deleted*/
Intelligent Security API (Access Control on Person) Developer Guide
## 226

## "@min": ,
## "@max":
## },
## },
"CardReaderDetail":{
/*optional, delete by fingerprint module, this node is valid when mode is "byCardReader"*/
"cardReaderNo":{
/*optional, integer, fingerprint module No.*/
## "@min": ,
## "@max":
## },
"clearAllCard":"true,false",
/*optional, boolean, whether to delete the fingerprint information of all cards: "false"-no (delete by employee No.),
"true"-yes (delete the fingerprint information of all employee No.)*/
"employeeNo":{
/*optional, string, employee No. (person ID) linked with the fingerprint, this node is valid when clearAllCard is
## "false"*/
## "@min": ,
## "@max":
## }
## }
## }
## }
6.1.45 JSON_Cap_GroupCfg
GroupCfg capability message in JSON format
## {
"GroupCfg":{
"groupNo":{
/*optional, integer, group No.*/
## "@min": ,
## "@max":
## },
## "enable":"true,false",
/*required, boolean, whether to enable the group*/
"ValidPeriodCfg":{
/*required, effective period parameters of the group*/
## "enable":"true,false",
/*required, boolean, whether to enable the effective period: "true"-yes, "false"-no. If the effective period is not
enabled, it indicates that the group is permanently valid*/
"beginTime":{
/*required, start time of the effective period (UTC time)*/
## "@min":1,
## "@max":32
## },
"endTime":{
/*required, end time of the effective period (UTC time)*/
## "@min":1,
## "@max":32
Intelligent Security API (Access Control on Person) Developer Guide
## 227

## }
## },
"groupName ":{
/*optional, string, group name*/
## "@min":1,
## "@max":32
## }
## }
## }
6.1.46 JSON_Cap_LogModeCfg
LogModeCfg capability message in JSON format
## {
"LogModeCfg":{
## "type":{
/*optional, integer, log mode: 1-16 bytes (the host log can be stored by 25w, and the employee No. can be stored by
16 bytes), 2-12 bytes (the host log can be stored by 25w, and the employee No. can be stored by 12 bytes). This node
will be set to 1 by default*/
## "@opt":"1,2"
## }
## }
## }
## 6.1.47
JSON_Cap_MultiCardCfg
MultiCardCfg capability message in JSON format
## {
"MultiCardCfg":{
"doorNo":{
/*optional, integer, door No.*/
## "@min": ,
## "@max":
## },
## "enable":"true,false",
/*required, boolean, whether to enable multi-factor authentication*/
"swipeIntervalTimeout":{
/*optional, integer, timeout of swiping (authentication) interval, which is between 1 and 255, and the default value is
10, unit: second*/
## "@min":1,
## "@max":255
## },
"GroupCfg":{
/*optional, multi-factor authentication parameters*/
"maxSize":20,
## "id":{
/*optional, integer, multi-factor authentication No., which is between 1 and 20*/
Intelligent Security API (Access Control on Person) Developer Guide
## 228

## "@min":1,
## "@max":20
## },
## "enable":"true,false",
/*optional, boolean, whether to enable the multi-factor authentication*/
"enableOfflineVerifyMode":"true,false",
/*optional, boolean, whether to enable verification mode when the access control device is offline (the super
password will replace opening door remotely)*/
"templateNo":{
/*optional, integer, schedule template No. to enable the multi-factor authentication*/
## "@min":1,
## "@max":20
## },
"GroupCombination":{
/*optional, parameters of the multi-factor authentication group*/
"maxSize":8,
## "enable":"true,false",
/*optional, integer, whether to enable the multi-factor authentication group*/
"memberNum":{
/*optional, integer, number of members swiping cards*/
## "@min":1,
## "@max":20
## },
"sequenceNo":{
/*optional, integer, serial No. of swiping cards of the multi-factor authentication group, which is between 1 and 8*/
## "@min":1,
## "@max":8
## },
"groupNo":{
/*optional, integer, group No., 65534-super password, 65535-remotely open door. 65534 and 65535 do not need to
be returned by the device capability. If the device returns groupNo node, it indicates that the device supports 65534
and 65535*/
## "@min":1,
## "@max":20
## }
## }
## }
## }
## }
## 6.1.48
JSON_Cap_MultiDoorInterLockCfg
MultiDoorInterLockCfg capability message in JSON format
## {
"MultiDoorInterLockCfg":{
## "enable":"true,false",
/*required, boolean, whether to enable multi-door interlocking: "true"-yes, "false"-no*/
"MultiDoorGroup":{
/*optional, parameters of the multi-door interlocking group*/
"maxSize":8,
Intelligent Security API (Access Control on Person) Developer Guide
## 229

## "id":{
/*optional, integer, multi-door interlocking No., which is between 1 and 8*/
## "@min":1,
## "@max":8
## },
"doorNoList":{
/*optional, array, door No. list of multi-door interlocking (range of each door No. in the list), which is between 1 and
## 8*/
## "@min":1,
## "@max":8
## },
"doorNoListLen":{
/*optional, range of the list length of multi-door interlocking, e.g., the list length of [1,3,5] is 3*/
## "@min":1,
## "@max":8
## }
## }
## }
## }
6.1.49 JSON_Cap_OSDPModify
OSDPModify capability message in JSON format
## {
"OSDPModify":{
## "id":{
/*required, integer, range of the original OSDP card reader ID*/
## "@min": ,
## "@max":
## },
"newID":{
/*required, integer, new ID of the OSDP card reader*/
## "@min": ,
## "@max":
## }
## }
## }
6.1.50 JSON_Cap_OSDPStatus
OSDPStatus capability message in JSON format
## {
"OSDPStatus":{
## "id":{
/*required, integer, range of the OSDP card reader ID*/
## "@min": ,
## "@max":
Intelligent Security API (Access Control on Person) Developer Guide
## 230

## },
## "status":"online,offline"
/*required, string, online status: "online", "offline"*/
## }
## }
6.1.51 JSON_Cap_PhoneDoorRightCfg
PhoneDoorRightCfg capability message in JSON format
## {
"PhoneDoorRightCfg":{
"phoneNo":{
/*optional, integer, No. of the mobile phone number whitelist*/
## "@min": ,
## "@max":
## },
"openRight":{
/*optional, array, whether to have permission to open the door*/
## "@min": ,
## "@max":
## },
"closeRight":{
/*optional, array, whether to have permission to close the door*/
## "@min": ,
## "@max":
## },
"alwaysOpenRight":{
/*optional, array, whether to have permission to remain the door unlocked*/
## "@min": ,
## "@max":
## },
"alwaysCloseRight":{
/*optional, array, whether to have permission to remain the door locked*/
## "@min": ,
## "@max":
## },
"armRight":{
/*optional, array, whether to have permission to arm the alarm input port*/
## "@min": ,
## "@max":
## },
"disarmRight":{
/*optional, array, whether to have permission to disarm the alarm input port*/
## "@min": ,
## "@max":
## }
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 231

6.1.52 JSON_Cap_PictureServerInformation
PictureServerInformation capability message in JSON format
## {
"PictureServerInformation":{
"pictureServerType":{
/*required, string type, picture storage server type: "tomact", "VRB", "cloudStorage"-cloud storage, "KMS"*/
"@opt":"tomact,VRB,cloudStorage,KMS",
## "#text":""
## },
"addressingFormatType":{
/*required, string type, format type of the picture storage server address: "ipaddress"-IP address (default),
"hostname"-host name*/
## "@opt":"ipaddress,hostname",
## "#text":""
## },
"hostName":{
/*string type, domain name of the picture storage server, the string length is between 0 and 64. This field is valid
when addressingFormatType is "hostname"*/
## "@min":0,
## "@max":64,
## "#text":""
## },
"ipv4Address":{
/*string type, IPv4 address of the picture storage server, the string length is between 0 and 64. This
field is valid when
addressingFormatType is "ipaddress"*/
## "@min":0,
## "@max":64,
## "#text":""
## },
"ipv6Address":{
/*string type, IPv6 address of the picture storage server, the string length is between 0 and 128. This field is valid
when addressingFormatType is "ipaddress"*/
## "@min":0,
## "@max":128,
## "#text":""
## },
"portNo":{
/*required, integer type, port No. of the picture storage server, which is between 1024 and 65535*/
## "@min":1024,
## "@max":65535,
## "#text":
## },
"underlyingProtocol":{
/*optional, string, bottom-level protocol of the picture storage server: "HTTP", "HTTPS". This field is valid when
pictureServerType contains "cloudStorage"*/
## "@opt":["http","https"]
## },
"cloudStorage":{
/*parameters of the clould storage server, which is valid when pictureServerType is "cloudStorage"*/
Intelligent Security API (Access Control on Person) Developer Guide
## 232

"cloudManageHttpPort":{
/*required, integer type, HTTP port No. for central management of the cloud storage server, which is between 1024
and 65535*/
## "@min":1024,
## "@max":65535,
## "#text":
## },
"cloudTransDataPort":{
/*required, integer type, data transmission port No. of the cloud storage server, which is between 1024 and 65535*/
## "@min":1024,
## "@max":65535,
## "#text":
## },
"cloudCmdPort":{
/*required, integer type, signaling port No. of the cloud storage server, which is between 1024 and 65535*/
## "@min":1024,
## "@max":65535,
## "#text":
## },
"cloudHeartBeatPort":{
/*required, integer type, heartbeat port No. of the cloud storage server, which is between 1024 and 65535*/
## "@min":1024,
## "@max":65535,
## "#text":
## },
"cloudStorageHttpPort":{
/*required, integer type, HTTP port No. of the cloud storage server, which is between 1024 and 65535*/
## "@min":1024,
## "@max":65535,
## "#text":
## },
"cloudUsername":{
/*required, string type, user name of the cloud storage server, the string length is between 0 and 32*/
## "@min":0,
## "@max":32,
## "#text":""
## },
"cloudPassword":{
/*required, string type, password of the cloud storage server, the string length is between 0 and 32*/
## "@min":0,
## "@max":32,
## "#text":""
## },
"cloudPoolId":{
/*required, integer type, cloud storage pool ID, which is between 1 and 4294967295. If this field is not configured by
the upper-level, this field will be set to 1 by default*/
## "@min":1,
## "@max":4294967295,
## "#text":
## },
"cloudPoolIdEx":{
/*optional, string, cloud storage pool ID, this node is valid when cloud storage pool ID of type string is supported*/
Intelligent Security API (Access Control on Person) Developer Guide
## 233

## "@min":0,
## "@max":0,
## "#text":""
## },
"clouldProtocolVersion":{
/*required, string type, protocol version of the cloud storage server, the string length is between 0 and 32*/
## "@min":0,
## "@max":32,
## "#text":""
## },
"clouldAccessKey":{
/*string type, cloud storage server access_key, the string length is between 0 and 64. This field is valid when
clouldProtocolVersion is "V2.0"*/
## "@min":0,
## "@max":64
## },
"clouldSecretKey":{
/*string type, cloud storage server secret_key, the string length is between 0 and 64. This field is valid when
clouldProtocolVersion is "V2.0"*/
## "@min":0,
## "@max":64
## }
## }
## }
## }
6.1.53 JSON_Cap_PrinterCfg
PrinterCfg capability message in JSON format
## {
"PrinterCfg":{
## "enable":{
/*required, boolean, whether to enable the printer*/
## "@opt":"true,false"
## },
"printFormat":{
"vistorPic":{
/*optional, visitor picture*/
## "enable":{
/*required, boolean, whether to print visitor picture*/
## "@opt":"true,false"
## },
"lineNo":{
/*required, integer, line No.*/
## "@min": 1,
## "@max": 255,
## }
## },
"vistorName":{
/*optional, visitor name*/
Intelligent Security API (Access Control on Person) Developer Guide
## 234

## "enable":{
/*required, boolean, whether to print visitor name*/
## "@opt":"true,false"
## },
"lineNo":{
/*required, integer, line No.*/
## "@min": 1,
## "@max": 255,
## }
## },
"certificateNumber":{
/*optional, visitor's certificate No.*/
## "enable":{
/*required, boolean, whether to print visitor's certificate No.*/
## "@opt":"true,false"
## },
"lineNo":{
/*required, integer, line No.*/
## "@min": 1,
## "@max": 255,
## }
## },
## "address":{
/*optional, visitor's address*/
## "enable":{
/*required, boolean, whether to print visitor's address*/
## "@opt":"true,false"
## },
"lineNo":{
/*required, integer, line No.*/
## "@min": 1,
## "@max": 255,
## }
## },
## "validity":{
/*optional, expiry date*/
## "enable":{
/*required, whether to print the expiry date*/
## "@opt":"true,false"
## },
"lineNo":{
/*required, integer, line No.*/
## "@min": 1,
## "@max": 255,
## }
## },
"receptionDepartment":{
/*optional, reception department*/
## "enable": {
/*required, boolean, whether to print the reception department*/
## "@opt":"true,false"
## },
Intelligent Security API (Access Control on Person) Developer Guide
## 235

"lineNo":{
/*required, integer, line No.*/
## "@min": 1,
## "@max": 255,
## }
## },
"receptionStaff":{
/*optional, receptionist information*/
## "enable":{
/*required, boolean, whether to print the receptionist information*/
## "@opt":"true,false"
## },
"lineNo":{
/*required, integer, line No.*/
## "@min": 1,
## "@max": 255,
## }
## },
"registrationTime":{
/*optional, registered time*/
## "enable":{
/*optional, whether to print the registered time*/
## "@opt":"true,false"
## },
"lineNo":{
/*required, integer, line No.*/
## "@min": 1,
## "@max": 255,
## }
## },
## }
## }
## }
6.1.54 JSON_Cap_RemoteControlBuzzer
RemoteControlBuzzer capability message in JSON format
## {
"RemoteControlBuzzer":{
"cardReaderNo":{
/*optional, integer, card reader No. (buzzer No.)*/
## "@min": ,
## "@max":
## },
## "cmd":{
/*required, string, command: "start"-start buzzing, "stop"-stop buzzing*/
## "@opt":"start,stop"
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 236

## }
## }
6.1.55 JSON_Cap_RemoteControlPWCfg
RemoteControlPWCfg capability message in JSON format
## {
"RemoteControlPWCfg":{
## "password":{
/*optional, string type, password for remote door control. The password must contain 6 digits and it ranges from
000000 to 999999*/
## "@min":000000,
## "@max":999999
## }
## }
## }
6.1.56 JSON_Cap_RemoteControlPWCheck
RemoteControlPWCheck capability message in JSON format
## {
"RemoteControlPWCfg":{
## "password":{
/*optional, string type, password for remote door control (or EZVIZ verification code). The password must contain 6
digits and it ranges from 000000 to 999999*/
## "@min":000000,
## "@max":999999
## }
## }
## }
6.1.57 JSON_Cap_SetAlarmHostOut
SetAlarmHostOut capability message in JSON format
## {
"SetAlarmHostOut":{
"alarmOutPort":{
/*required, integer, alarm output port index, which starts from 0, 65535-all alarm output ports*/
## "@min": ,
## "@max":
## },
"alarmOutStatus":{
/*required, string, alarm output status: "stop"-stop output, "start"-start output*/
## "@max":"stop,start"
Intelligent Security API (Access Control on Person) Developer Guide
## 237

## }
## }
## }
6.1.58 JSON_Cap_SmsRelativeParam
SmsRelativeParam capability message in JSON format
## {
"SmsRelativeParam":{
"WhiteList":{
/*required, mobile phone number whitelist*/
"maxSize":32,
/*maximum number of mobile phone number whitelists*/
## "id":{
/*required, integer, No. of mobile phone number whitelist*/
## "@min": ,
## "@max":
## },
"phoneNo":{
/*required, string, mobile phone number*/
## "@min": ,
## "@max":
## },
"doorControl":"true,false",
/*optional, boolean, whether to support door operation control: "true"-yes, "false"-no*/
"acsPassword":{
/*optional, string, command to open the door*/
## "@min": ,
## "@max":
## }
## }
## }
## }
6.1.59 JSON_TTSTextCap
JSON message about the text configuration capability of the audio prompt for the authentication
results
## {
"TTSTextCap":{
"enable":[true, false],
/*required, boolean, whether to enable: true-enable, false-disable*/
## "prefix":["name", "lastname", "none"],
/*optional, string, whether to play the audio with "user name" or "honorific and last name of the user" as the prefix:
"name"-play the audio with "user name" (e.g., "Jack Smith" will be played), "lastname"-play the audio with "honorific
and last name of the user" (e.g., "Mr. Smith" will be played), "none" (default)*/
"Success":{
Intelligent Security API (Access Control on Person) Developer Guide
## 238

"maxSize":4,
"TimeSegment":{
"beginTime":"",
/*required, string, start time, which is between 00:00:00 and 23:59:59*/
"endTime":"",
/*required, string, end time, which is between 00:00:00 and 23:59:59*/
"validUnit":""
/*optional, string, time accuracy: "hour", "minute", "second". If this field is not returned, it indicates that the default
time accuracy is "minute"*/
## },
## "language":{
/*optional, string, language: "SimChinese", "TraChinese", "English"*/
"@opt":["SimChinese", "TraChinese", "English"]
## },
## "text":{
/*required, string, text of the audio prompt*/
## "@min": ,
## "@max":
## }
## },
"Failure":{
"maxSize":4,
"TimeSegment":{
"beginTime":"",
/*required, string, start time, which is between 00:00:00 and 23:59:59*/
"endTime":"",
/*required, string, end time, which is between 00:00:00 and 23:59:59*/
"validUnit":""
/*optional, string, time accuracy: "hour", "minute", "second". If this field is not returned, it indicates that the default
time accuracy is "minute"*/
## },
## "language":{
/*optional, string, language: "SimChinese", "TraChinese", "English"*/
"@opt":["SimChinese", "TraChinese", "English"]
## },
## "text":{
/*required, string, text of the audio prompt*/
## "@min": ,
## "@max":
## }
## }
## }
## }
6.1.60 JSON_Cap_UserInfo
UserInfo capability message in JSON format
## {
"UserInfo":{
"supportFunction":{
Intelligent Security API (Access Control on Person) Developer Guide
## 239

/*required, supported function of adding, deleting, editing, searching for person information, and getting total
number of the added persons: "post"-add, "delete", "put"-edit, "get"-search, "setUp"-set*/
"@opt":"post,delete,put,get,setUp"
## },
"UserInfoSearchCond":{
/*optional, search conditions*/
"searchID":{
/*required, string type, search ID, which is used to check the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
## "@min":1,
## "@max":36
## },
"maxResults":{
/*required, integer32, maximum number of search results*/
## "@min":1,
## "@max":30
## },
"EmployeeNoList":{
/*optional, person ID list*/
"maxSize":56,
"employeeNo":{
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## }
## },
"fuzzySearch":{
/*optional, string, keywords for fuzzy search*/
## "@min": ,
## "@max":
## },
"isSupportNumOfFace":0,
/*optional, integer, whether it supports number of linked face pictures when searching. If this field is not returned, it
indicates that this function is not supported*/
"isSupportNumOfFP":0,
/*optional, integer, whether it supports number of linked fingerprints when searching. If this field is not returned, it
indicates that this function is not supported*/
"isSupportNumOfCard":0
/*optional, integer, whether it supports number of linked cards when searching. If this field is not returned, it
indicates that this function is not supported*/
## },
"UserInfoDelCond":{
/*optional, deleting conditions*/
"EmployeeNoList":{
/*optional, person ID list (if this node does not exist, it indicates deleting all person information)*/
"maxSize":56,
"employeeNo":{
/*optional, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 240

## }
## },
"employeeNo":{
/*required, string, employee No. (person ID)*/
## "@min": ,
## "@max":
## },
## "name":{
/*optional, string, name*/
## "@min":1,
## "@max":32
## },
"userType":{
/*required, string, person type: "normal"-normal person (household), "visitor", "blackList"-person in blacklist*/
"@opt":"normal,visitor,blackList"
## },
"closeDelayEnabled":"true,false",
/*optional, boolean, whether to enable door close delay: "true"-yes, "false"-no*/
"Valid":{
/*required, parameters of the effective period*/
"enable":"true, false",
/*required, boolean, whether to enable the effective period: "false"-disable, "true"-enable. If this node is set to
"false", the effective period is permanent*/
"beginTime":{
/*required, start time of the effective period (if timeType does not exist or is "local", the beginTime is the device local
time, e.g.,: 2017-08-01T17:30:08; if timeType is "UTC", the beginTime is UTC time, e.g.,:
## 2017-08-01T17:30:08+08:00)*/
## "@min":1,
## "@max":32
## },
"endTime":{
/*required, end time of the effective period (if timeType does not exist or is "local", the endTime is the device local
time, e.g.,: 2017-08-01T17:30:08; if timeType is "UTC", the endTime is UTC time, e.g.,: 2017-08-01T17:30:08+08:00)*/
## "@min":1,
## "@max":32
## },
"timeRangeBegin":"",
/*optional, string, start time that can be configured for beginTime. If the device does not return this node, the default
start time that can be configured for beginTime is "1970-01-01T00:00:00"*/
"timeRangeEnd":"",
/*optional, string, end time that can be configured for endTime. If the device does not return this node, the default
end time that can be configured for endTime is "2037-12-31T23:59:59"*/
"timeType":{
/*optional, string, time type: "local"- device local time, "UTC"- UTC time*/
"@opt":"local,UTC"
## }
## },
"maxBelongGroup":4,
/*optional, integer, maximum number of groups that a person can belong to*/
"belongGroup":{
/*optional, string, group*/
## "@min":1,
Intelligent Security API (Access Control on Person) Developer Guide
## 241

## "@max":32
## },
## "password":{
/*optional, string, password*/
## "@min":1,
## "@max":32
## },
"doorRight":{
/*optional, string, No. of door or lock that has access permission*/
## "@min":1,
## "@max":32
## },
"RightPlan":{
/*optional, door permission schedule (lock permission schedule)*/
"maxSize":32,
"doorNo":{
/*optional, integer, door No. (lock ID)*/
## "@min":1,
## "@max":32
## },
"maxPlanTemplate":4,
/*optional, integer, maximum number of schedule templates that can be configured for one door*/
"planTemplateNo":{
/*optional, string, schedule template No.*/
## "@min":1,
## "@max":32
## }
## },
"maxOpenDoorTime":{
/*optional, integer, maximum authentication attempts, 0-unlimited*/
## "@min":0,
## "@max":100
## },
"openDoorTime":{
/*optional, integer, read-only, authenticated attempts*/
## "@min":0,
## "@max":100
## },
"roomNumber":{
/*optional, integer, room No.*/
## "@min":0,
## "@max":100
## },
"floorNumber":{
/*optional, integer, floor No.*/
## "@min":0,
## "@max":100
## },
"doubleLockRight":"true, false",
/*optional, boolean, whether to have the permission to open the double-locked door: "true"-yes, "false"-no*/
"localUIRight":"true, false",
/*optional, boolean, whether to have the permission to access the device local UI: "true"-yes, "false"-no*/
Intelligent Security API (Access Control on Person) Developer Guide
## 242

"userVerifyMode":{
/*optional, string, person authentication mode: "cardAndPw"-card+password, "card"-card, "cardOrPw"-card or
password, "fp"-fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint
+card, "fpAndCardAndPw"-fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or
password, "faceAndFp"-face+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face"-face,
"employeeNoAndPw"-employee No.+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee
No.+fingerprint, "employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face
+fingerprint+card, "faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face,
"faceOrfaceAndCard"-face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password,
"cardOrFace"-card or face, "cardOrFaceOrFp"-card or face or fingerprint, "cardOrFpOrPw"-card or fingerprint or
password. The priority of the person authentication mode is higher than that of the card reader authentication
mode*/

"@opt":"cardAndPw,card,cardOrPw,fp,fpAndPw,fpOrCard,fpAndCard,fpAndCardAndPw,faceOrFpOrCardOrPw,faceAnd
Fp,faceAndPw,faceAndCard,face,employeeNoAndPw,fpOrPw,employeeNoAndFp,employeeNoAndFpAndPw,faceAndFp
AndCard,faceAndPwAndFp,employeeNoAndFace,faceOrfaceAndCard,fpOrface,cardOrfaceOrPw,cardOrFace,cardOrFac
eOrFp,cardOrFpOrPw"
## },
"checkUser":"true, false",
/*optional, boolean, whether to verify the duplicated person information: "false"-no, "true"-yes. If checkUser is not
configured, the device will verify the duplicated person information by default. When there is no person information,
you can set checkUser to "false" to speed up data applying; otherwise, it is not recommended to configure this node*/
"addUser": "true,false",
/*optional, boolean type, whether to add the person if the person information being edited does not exist: "false"-no
(if the device has checked that the person information being edited does not exist, the failure response message will
be returned along with the error code), "true"-yes (if the device has checked that the person information being edited
does not exist, the success response message will be returned, and the person will be added). If this node is not
configured, the person will not be added by default*/
"maxRecordNum": ,
/*required, integer type, supported maximum number of records (person records)*/
"callNumbers": {
/*optional, string type, room No. list to be called, which is extended from roomNumber and it is in higher priority; by
default, the No. format is X-X-X-X, e.g., 1-1-1-401, and for standard SIP, it can be the SIP number; this node must be
configured together with roomNumber*/
"maxSize": ,
/*range of members in the array*/
## "@min": 0,
/*minimum string length*/
## "@max": 100
/*maximum string length*/
## },
"floorNumbers": {
/*optional, integer type, floor No. list, which is extended from floorNumber and it is in higher priority; this node must
be configured together with floorNumber*/
"maxSize": ,
/*range of members in the array*/
## "@min": 0,
/*minimum floor No.*/
## "@max": 100
/*maximum floor No.*/
## },
## "gender":{
Intelligent Security API (Access Control on Person) Developer Guide
## 243

/*optional, string, gender of the person in the face picture: "male", "female", "unknown"*/
## "@opt":"male,female,unknown"
## },
"PersonInfoExtends": {
/*optional, person extension information*/
"maxSize":3,
/*required, integer, supported maximum number of extension fields*/
## "name":{
/*optional, string, name of the person extension information*/
## "@min": 0,
## "@max": 100
## },
## "value":{
/*optional, string, content of the person extension information*/
## "@min": 0,
## "@max": 100
## }
## },
"purePwdVerifyEnable":
/*optional, boolean, whether the device supports opening the door only by password: true-yes, this node is not
returned-no. The password used to open the door is the value of the node password in the message JSON_UserInfo.*/
/*For opening the door only by password: 1. The password in "XXX or password" in the authentication mode refers to
the person's password (the value of the node password in JSON_UserInfo); 2. The device will not check the
duplication of the password, and the upper platform should ensure that the password is unique; 3. The password
cannot be added, deleted, edited, or searched for on the device locally.*/
## }
## }
6.1.61 JSON_Cap_UserInfoDetail
UserInfoDetail capability message in JSON format
## {
"UserInfoDetail":{
## "mode":{
"@opt":"all,byEmployeeNo"
/*required, string type, deleting mode: "all"-delete all, "byEmployeeNo"-delete by employee No. (person ID)*/
## },
"EmployeeNoList":{
/*optional, person ID list*/
"maxSize": ,
"employeeNo":{
/*optional, string type, employee No. (person ID), it is valid when mode is "byEmployeeNo"*/
## "@min": ,
## "@max":
## }
## }
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 244

6.1.62 JSON_Cap_UserRightHolidayGroupCfg
UserRightHolidayGroupCfg capability message in JSON format
## {
"UserRightHolidayGroupCfg": {
"groupNo": {
/*holiday group No.*/
## "@min": 1,
## "@max": 16
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"groupName": {
/*holiday group name*/
## "@min": 1,
## "@max": 32
## },
"holidayPlanNo": {
/*holiday group schedule No.*/
## "@min": 1,
## "@max": 16
## }
## }
## }
6.1.63 JSON_Cap_UserRightHolidayPlanCfg
UserRightHolidayPlanCfg capability message in JSON format
## {
"UserRightHolidayPlanCfg": {
"planNo": {
/*holiday schedule No.*/
## "@min": 1,
## "@max": 16
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"beginDate": "",
/*start date of the holiday (device local time)*/
"endDate": "",
/*end date of the holiday (device local time)*/
"HolidayPlanCfg": {
/*holiday schedule parameter*/
"maxSize": 8,
## "id": {
/*time period No.*/
## "@min": 1,
Intelligent Security API (Access Control on Person) Developer Guide
## 245

## "@max": 8
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"TimeSegment": {
"beginTime": "",
/*start time of the time period (device local time)*/
"endTime": "",
/*end time of the time period (device local time)*/
"validUnit":
/*time accuracy: "hour", "minute", "second". If this node is not returned, it indicates that the time accuracy is
## "minute"*/
## }
## }
## }
## }
6.1.64 JSON_Cap_UserRightPlanTemplate
UserRightPlanTemplate capability message in JSON format
## {
"UserRightPlanTemplate": {
"templateNo": {
/*schedule template No.*/
## "@min": 1,
## "@max": 16
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"templateName": {
/*template name*/
## "@min": 1,
## "@max": 32
## },
"weekPlanNo" : {
/*week schedule No.*/
## "@min": 1,
## "@max": 16
## },
"holidayGroupNo": {
/*holiday group No.*/
## "@min": 1,
## "@max": 16
## }
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 246

6.1.65 JSON_Cap_UserRightWeekPlanCfg
UserRightWeekPlanCfg capability message in JSON format
## {
"UserRightWeekPlanCfg":{
"planNo":{
/*week schedule No.*/
## "@min":1,
## "@max":16
## },
## "enable":"true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"WeekPlanCfg":{
/*week schedule parameter*/
"maxSize":56,
## "week":{
"@opt":"Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
## },
## "id":{
## "@min":1,
## "@max":8
## },
## "enable":"true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"TimeSegment":{
"beginTime":"",
## /*start
time of the time period (device local time)*/
"endTime":"",
/*end time of the time period (device local time)*/
"validUnit":
/*time accuracy: "hour", "minute", "second". If this node is not returned, it indicates that the time accuracy is
## "minute"*/
## }
## }
## }
## }
6.1.66 JSON_Cap_VerifyHolidayGroupCfg
VerifyHolidayGroupCfg capability message in JSON format
## {
"VerifyHolidayGroupCfg ": {
"groupNo": {
/*holiday group No.*/
## "@min": 1,
## "@max": 16
## },
Intelligent Security API (Access Control on Person) Developer Guide
## 247

## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"groupName": {
/*holiday group name*/
## "@min": 1,
## "@max": 32
## },
"holidayPlanNo": {
/*holiday group schedule No.*/
## "@min": 1,
## "@max": 16
## }
## }
## }
6.1.67 JSON_Cap_VerifyHolidayPlanCfg
VerifyHolidayPlanCfg capability message in JSON format
## {
"VerifyHolidayPlanCfg": {
"planNo": {
/*holiday schedule template No.*/
## "@min": 1,
## "@max": 16
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"beginDate": "",
/*start date of the holiday (device local time)*/
"endDate": "",
/*end date of the holiday (device local time)*/
"HolidayPlanCfg": {
/*holiday schedule parameters*/
"maxSize": 8,
## "id": {
/*time period No.*/
## "@min": 1,
## "@max": 8
## },
"enable": "true, false",
/*whether to enable: "true"-enable, "false"-disable*/
"verifyMode": {
/*authentication mode: "cardAndPw"-card+password, "card", "cardOrPw"-card or password, "fp"-fingerprint,
"fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint+card, "fpAndCardAndPw"-
fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or password, "faceAndFp"-face
+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face", "employeeNoAndPw"-employee No.
+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee No.+fingerprint,
"employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face+fingerprint+card,
"faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face, "faceOrfaceAndCard"-
face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password, "cardOrFace"-card or
Intelligent Security API (Access Control on Person) Developer Guide
## 248

face, "cardOrFaceOrFp"-card or face or fingerprint, "cardOrFpOrPw"-card or fingerprint or password, "sleep",
## "invalid"*/
## "@opt":
"cardAndPw,card,cardOrPw,fp,fpAndPw,fpOrCard,fpAndCard,fpAndCardAndPw,faceOrFpOrCardOrPw,faceAndFp,faceA
ndPw,faceAndCard,face,employeeNoAndPw,fpOrPw,employeeNoAndFp,employeeNoAndFpAndPw,faceAndFpAndCard,
faceAndPwAndFp,employeeNoAndFace,faceOrfaceAndCard,fpOrface,cardOrfaceOrPw,cardOrFace,cardOrFaceOrFp,car
dOrFpOrPw,sleep,invalid"
## },
"TimeSegment": {
"beginTime": "",
/*start time of the time period (device local time)
"endTime": "",
/*end time of the time period (device local time)
"validUnit":
/*time accuracy: "hour", "minute", "second". If this node is not returned, it indicates that the time accuracy is
## "minute"*/
## }
## },
"purePwdVerifyEnable":
/*optional, boolean, whether the device supports opening the door only by password: true-yes, this node is not
returned-no. The password used to open the door is the value of the node password in the message JSON_UserInfo.*/
/*For opening the door only by password: 1. The password in "XXX or password" in the authentication mode refers to
the person's password (the value of the node password in JSON_UserInfo); 2. The device will not check the
duplication of the password, and the upper platform should ensure that the password is unique; 3. The password
cannot be added, deleted, edited, or searched for on the device locally.*/
## }
## }
6.1.68 JSON_Cap_VerifyPlanTemplate
VerifyPlanTemplate capability message in JSON format
## {
"VerifyPlanTemplate": {
"templateNo": {
/*schedule template No.*/
## "@min": 1,
## "@max": 16
## },
## "enable": "true,false",
/*whether to enable: "true"-enable, "false"-disable*/
"templateName": {
/*template name*/
## "@min": 1,
## "@max": 32
## },
"weekPlanNo": {
/*week schedule No.*/
## "@min": 1,
## "@max": 16
## },
Intelligent Security API (Access Control on Person) Developer Guide
## 249

"holidayGroupNo": {
/*holiday group No.*/
## "@min": 1,
## "@max": 16
## }
## }
## }
6.1.69 JSON_Cap_VerifyWeekPlanCfg
VerifyWeekPlanCfg capability message in JSON format
## {
"VerifyWeekPlanCfg":{
"planNo":{
/*week schedule No.*/
## "@min":1,
## "@max":16
## },
## "enable":"",
/*whether to enable: "true"-enable, "false"-disable*/
"WeekPlanCfg":{
/*week schedule parameters*/
"maxSize":56,
## "week":{
"@opt":"Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
## },
## "id":{
## "@min":1,
## "@max":8
## },
"enable":"true, false",
/*whether to enable: "true"-enable, "false"-disable*/
"verifyMode":{
/*authentication mode: "cardAndPw"-card+password, "card", "cardOrPw"-card or password, "fp"-fingerprint,
"fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint+card, "fpAndCardAndPw"-
fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or password, "faceAndFp"-face
+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face", "employeeNoAndPw"-employee No.
+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee No.+fingerprint,
"employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face+fingerprint+card,
"faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face, "faceOrfaceAndCard"-
face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password, "cardOrFace"-card or
face, "cardOrFaceOrFp"-card or face or fingerprint, "cardOrFpOrPw"-card or fingerprint or password, "sleep",
## "invalid"*/

"@opt":"cardAndPw,card,cardOrPw,fp,fpAndPw,fpOrCard,fpAndCard,fpAndCardAndPw,faceOrFpOrCardOrPw,faceAnd
Fp,faceAndPw,faceAndCard,face,employeeNoAndPw,fpOrPw,employeeNoAndFp,employeeNoAndFpAndPw,faceAndFp
AndCard,faceAndPwAndFp,employeeNoAndFace,faceOrfaceAndCard,fpOrface,cardOrfaceOrPw,cardOrFace,cardOrFac
eOrFp,cardOrFpOrPw,sleep,invalid"
## },
"TimeSegment":{
Intelligent Security API (Access Control on Person) Developer Guide
## 250

"beginTime":"",
/*start time of the time period (device local time)*/
"endTime":"",
/*end time of the time period (device local time)*/
"validUnit":
/*time accuracy: "hour", "minute", "second". If this node is not returned, it indicates that the time accuracy is
## "minute"*/
## }
## },
"purePwdVerifyEnable":
/*optional, boolean, whether the device supports opening the door only by password: true-yes, this node is not
returned-no. The password used to open the door is the value of the node password in the message JSON_UserInfo.*/
/*For opening the door only by password: 1. The password in "XXX or password" in the authentication mode refers to
the person's password (the value of the node password in JSON_UserInfo); 2. The device will not check the
duplication of the password, and the upper platform should ensure that the password is unique; 3. The password
cannot be added, deleted, edited, or searched for on the device locally.*/
## }
## }
6.1.70 JSON_CardInfo
CardInfo message in JSON format
## {
"CardInfo":{
"employeeNo":"",
/*required, string, employee No. (person ID)*/
"cardNo":"",
/*required, string, card No.*/
"deleteCard": ,
/*optional, boolean, whether to delete the card: "true"-yes. This node is required only when the card needs to be
deleted; for adding or editing card information, this node can be set to NULL*/
"cardType":"",
/*optional, string, card type: "normalCard"-normal card, "patrolCard"-patrol card, "hijackCard"-duress card,
"superCard"-super card, "dismissingCard"-dismiss card, "emergencyCard"-emergency card (it is used to assign
permission to a temporary card, but it cannot open the door)*/
"leaderCard":"",
/*optional, string, whether to support first card authentication function, e.g., the value "1,3,5" indicates that the
access control points No.1, No.3, and No.5 support first card authentication function*/
"checkCardNo":"",
/*optional, boolean, whether to enable duplicated card verification: "false"-disable, "true"-enable. If this node is not
configured, the device will verify the duplicated card by default. When there is no card information, you can set
checkCardNo to "false" to speed up data applying; otherwise, it is not recommended to configure this node*/
"checkEmployeeNo": ,
/*optional, boolean, whether to check the existence of the employee No. (person ID): "false"-no, "true"-yes. If this
node is not configured, the device will check the existence of the employee No. (person ID) by default. If this node is
set to "false", the device will not check the existence of the employee No. (person ID) to speed up data applying; if this
node is set to "true" or NULL, the device will check the existence of the employee No. (person ID), and it is
recommended to set this node to "true" or NULL if there is no need to speed up data applying*/
"addCard":
/*optional, boolean type, whether to add the card if the card information being edited does not exist: "false"-no (if
Intelligent Security API (Access Control on Person) Developer Guide
## 251

the device has checked that the card information being edited does not exist, the failure response message will be
returned along with the error code), "true"-yes (if the device has checked that the card information being edited does
not exist, the success response message will be returned, and the card will be added). If this node is not configured,
the card will not be added by default*/
## }
## }
## Remarks
The employeeNo and cardNo cannot be edited. If you need to edit the cardNo, you should delete
the previous card and create a new card.
6.1.71 JSON_CardInfo_Collection
CardInfo message in JSON format
## {
"CardInfo":{
"cardNo":"",
/*required, string, card No.*/
"cardType":""
/*optional, string, card type: "TypeA_M1", "TypeA_CPU", "TypeB", "ID_125K"*/
## }
## }
6.1.72 JSON_CardInfoCap
CardInfoCap capability message in JSON format
## {
"CardInfoCap":{
"cardNo":{
/*required, string, card No.*/
## "@min":1,
## "@max":32
## },
"cardType": ["TypeA_M1","TypeA_CPU","TypeB","ID_125K"]
/*optional, string, card type: "TypeA_M1", "TypeA_CPU", "TypeB", "ID_125K"*/
## }
## }
6.1.73 JSON_CardInfoCount
CardInfoCount message in JSON format
## {
"CardInfoCount":{
"cardNumber":
Intelligent Security API (Access Control on Person) Developer Guide
## 252

/*number of cards*/
## }
## }
6.1.74 JSON_CardInfoDelCond
CardInfoDelCond message in JSON format
## {
"CardInfoDelCond":{
"EmployeeNoList" :[{
/*optional, person ID list, if this node does not exist or is set to NULL, it indicates deleting all cards*/
"employeeNo":""
/*optional, string, employee No. (person ID)*/
## }],
"CardNoList":[{
/*optional, card No. list (this node cannot exist together with the EmployeeNoList, and if this node does not exist or is
set to NULL, it indicates deleting all cards)*/
"cardNo":""
/*optional, string, card No.*/
## }]
## }
## }
6.1.75 JSON_CardInfoSearch
CardInfoSearch message in JSON format
## {
"CardInfoSearch":{
"searchID":"",
/*required, string, search ID, which is used to confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
"responseStatusStrg":"",
/*required, string, search status: "OK"-searching completed, "NO MATCH"-no matched results, "MORE"-searching for
more results*/
"numOfMatches": ,
/*required, integer32, number of returned results*/
"totalMatches": ,
/*required, integer32, total number of matched results*/
"CardInfo":[{
/*optional, person information*/
"employeeNo":"",
/*required, string, employee No. (person ID)*/
"cardNo":"",
/*required, string, card No.*/
"cardType":"",
/*required, string, card type: "normalCard"-normal card, "patrolCard"-patrol card, "hijackCard"-duress card,
Intelligent Security API (Access Control on Person) Developer Guide
## 253

"superCard"-super card, "dismissingCard"-dismiss card, "emergencyCard"-emergency card (it is used to assign
permission to a temporary card, but it cannot open the door)*/
"leaderCard":"",
/*optional, string, whether to support first card authentication function, e.g., the value "1,3,5" indicates that the
access control points No.1, No.3, and No.5 support first card authentication function*/
## }]
## }
## }
6.1.76 JSON_CardInfoSearchCond
CardInfoSearchCond message in JSON format
## {
"CardInfoSearchCond":{
"searchID":"",
/*required, string, search ID, which is used to confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/

"searchResultPosition": ,
/*required, integer32, the start position of the search result in the result list. When there are multiple records and you
cannot get all search results at a time, you can search for the records after the specified position next time. For
example, if the maximum total number of matched results (totalMatches) supported by the device is M and the total
number of matched results (totalMatches) stored in the device currently is N (here N is smaller than M), the valid
range of this field is from 0 to N-1*/
"maxResults": ,
/*required, integer32, maximum number of search results. If maxResults exceeds the range returned by the device
capability, the device will return the maximum number of search results according to the device capability and will not
return error message*/
"EmployeeNoList":[{
/*optional, person ID list (if this node does not exist or is set to NULL, it indicates searching for all cards)*/
"employeeNo":""
/*optional, string, employee No. (person ID)*/
## }],
"CardNoList":[{
/*optional, card No. list (this node cannot exist together with EmployeeNoList, and if this node does not exist or is set
to NULL, it indicates searching for all cards)*/
"cardNo":""
/*optional, string, card No.*/
## }]
## }
## }
## 6.1.77
JSON_CardReaderAntiSneakCfg
CardReaderAntiSneakCfg message in JSON format
## {
"CardReaderAntiSneakCfg": {
Intelligent Security API (Access Control on Person) Developer Guide
## 254

## "enable": ,
/*required, boolean, whether to enable the anti-passing back function of the card reader: "true"-enable, "false"-
disable*/
"followUpCardReader":
/*optional, array, following card reader No. after the first card reader, e.g., [2,3,4] indicates that card reader No. 2, No.
3, and No. 4 can be swiped after the first card reader*/
## }
## }
6.1.78 JSON_CardReaderCfg
CardReaderCfg message in JSON format
## {
"CardReaderCfg":{
## "enable": ,
/*required, boolean, whether to enable: "true"-yes, "false"-no*/
"okLedPolarity":"",
/*optional, string, OK LED polarity: "cathode", "anode"*/
"errorLedPolarity":"",
/*optional, string, error LED polarity: "cathode", "anode"*/
"buzzerPolarity":"",
/*optional, string, buzzer polarity: "cathode", "anode"*/
"swipeInterval": ,
/*optional, integer, time interval of repeated authentication, which is valid for authentication modes such as
fingerprint, card, face, etc., unit: second*/
"pressTimeout": ,
/*optional, integer, timeout to reset entry on keypad, unit: second*/
"enableFailAlarm": ,
/*optional, boolean, whether to enable excessive failed authentication attempts alarm*/
"maxReadCardFailNum": ,
/*optional, integer, maximum number of failed authentication attempts*/
"enableTamperCheck": ,
/*optional, boolean, whether to enable tampering detection*/
"offlineCheckTime": ,
/*optional, integer, time to detect after the card reader is offline, unit: second*/
"fingerPrintCheckLevel": ,
/*optional, integer, fingerprint recognition level: 1-1/10 false acceptance rate (FAR), 2-1/100 false acceptance rate
(FAR), 3-1/1000 false acceptance rate (FAR), 4-1/10000 false acceptance rate (FAR), 5-1/100000 false acceptance rate
(FAR), 6-1/1000000 false acceptance rate (FAR), 7-1/10000000 false acceptance rate (FAR), 8-1/100000000 false
acceptance rate (FAR), 9-3/100 false acceptance rate (FAR), 10-3/1000 false acceptance rate (FAR), 11-3/10000 false
acceptance rate (FAR), 12-3/100000 false acceptance rate (FAR), 13-3/1000000 false acceptance rate (FAR),
14-3/10000000 false acceptance rate (FAR), 15-3/100000000 false acceptance rate (FAR), 16-Automatic Normal, 17-
Automatic Secure, 18-Automatic More Secure (currently not support)*/
"useLocalController": ,
/*ro, opt, boolean, whether it is connected to the distributed controller*/
"localControllerID": ,
/*ro, opt, integer, distributed controller No., which is between 1 and 64, 0-unregistered. This field is valid only when
useLocalController is "true"*/
"localControllerReaderID": ,
/*ro, opt, integer, card reader ID of the distributed controller, 0-unregistered. This field is valid only when
Intelligent Security API (Access Control on Person) Developer Guide
## 255

useLocalController is "true"*/
"cardReaderChannel": ,
/*ro, opt, integer, communication channel No. of the card reader: 0-Wiegand or offline, 1-RS-485A, 2-RS-485B. This
field is valid only when useLocalController is "true"*/
"fingerPrintImageQuality": ,
/*opt, integer, fingerprint image quality: 1-low quality (V1), 2-medium quality (V1), 3-high quality (V1), 4-highest
quality (V1), 5-low quality (V2), 6-medium quality (V2), 7-high quality (V2), 8-highest quality (V2)*/
"fingerPrintContrastTimeOut": ,
/*optional, integer, fingerprint comparison timeout, which is between 1 and 20, unit: second, 255-infinite*/
"fingerPrintRecogizeInterval": ,
/*optional, integer, fingerprint scanning interval, which is between 1 and 10, unit: second, 255-no delay*/
"fingerPrintMatchFastMode": ,
/*optional, integer, fingerprint matching quick mode: 1-quick mode 1, 2-quick mode 2, 3-quick mode 3, 4-quick mode
4, 5-quick mode 5, 255-automatic*/
"fingerPrintModuleSensitive": ,
/*optional, integer, fingerprint module sensitivity, which is between 1 and 8*/
"fingerPrintModuleLightCondition":"",
/*optional, string, fingerprint module light condition: "outdoor", "indoor"*/
"faceMatchThresholdN": ,
/*optional, integer, threshold of face picture 1:N comparison, which is between 0 and 100*/
"faceQuality": ,
/*optional, integer, face picture quality, which is between 0 and 100*/
"faceRecogizeTimeOut": ,
/*optional, integer, face recognition timeout, which is between 1 and 20, unit: second, 255-infinite*/
"faceRecogizeInterval": ,
/*optional, integer, face recognition interval, which is between 1 and 10, unit: second, 255-no delay*/
"cardReaderFunction": ,
/*ro, opt, array, card reader type: "fingerPrint"-fingerprint, "face", "fingerVein"-finger vein. For example,
["fingerPrint","face"] indicates that the card reader supports both fingerprint and face*/
"cardReaderDescription":"",
/*ro, opt, string, card reader description. If the card reader is the Wiegand card reader or if offline, this field will be set
to "Wiegand" or "485Offline"*/
"faceImageSensitometry": ,
/*ro, opt, integer, face picture exposure, which is between 0 and 65535*/
"livingBodyDetect": ,
/*optional, boolean, whether to enable human detection*/
"faceMatchThreshold1": ,
/*optional, integer, threshold of face picture 1:1 comparison, which is between 0 and 100*/
"buzzerTime": ,
/*optional, integer, buzzing duration, which is between 0 and 5999, unit: second, 0-long buzzing*/
"faceMatch1SecurityLevel": ,
/*optional, integer, security level of face 1:1 recognition: 1-normal, 2-high, 3-higher*/
"faceMatchNSecurityLevel": ,
/*optional, integer, security level of face 1:N recognition: 1-normal, 2-high, 3-higher*/
"envirMode":"",
/*optional, string, environment mode of face recognition: "indoor", "other"*/
"liveDetLevelSet":"",
/*optional, string, threshold level of liveness detection: "low", "middle"-medium, "high"*/
"liveDetAntiAttackCntLimit": ,
/*optional, integer, number of anti-attacks of liveness detection, which is between 1 and 255. This value should be
configured as the same one on both client and device*/
"enableLiveDetAntiAttack": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 256

/*optional, boolean, whether to enable anti-attack for liveness detection*/
"supportDelFPByID": ,
/*ro, opt, boolean, whether the card reader supports deleting fingerprint by fingerprint ID: "true"-yes, "false"-no*/
"fingerPrintCapacity": ,
/*ro, opt, integer, fingerprint capacity, which is the maximum number of fingerprints that can be added*/
"fingerPrintNum": ,
/*ro, opt, integer, number of added fingerprints*/
"defaultVerifyMode":"",
/*ro, opt, string, default authentication mode of the fingerprint and card reader (factory defaults): "cardAndPw"-card
+password, "card", "cardOrPw"-card or password, "fp"-fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-
fingerprint or card, "fpAndCard"-fingerprint+card, "fpAndCardAndPw"-fingerprint+card+password,
"faceOrFpOrCardOrPw"-face or fingerprint or card or password, "faceAndFp"-face+fingerprint, "faceAndPw"-face
+password, "faceAndCard"-face+card, "face", "employeeNoAndPw"-employee No.+password, "fpOrPw"-fingerprint or
password, "employeeNoAndFp"-employee No.+fingerprint, "employeeNoAndFpAndPw"-employee No.+fingerprint
+password, "faceAndFpAndCard"-face+fingerprint+card, "faceAndPwAndFp"-face+password+fingerprint,
"employeeNoAndFace"-employee No.+face, "faceOrfaceAndCard"-face or face+card, "fpOrface"-fingerprint or face,
"cardOrfaceOrPw"-card or face or password, "cardOrFace"-card or face, "cardOrFaceOrFp"-card or face or fingerprint*/
"faceRecogizeEnable": ,
/*optional, integer, whether to enable facial recognition: 1-enable, 2-disable, 3-attendence checked in/out by
recognition of multiple faces*/
"FPAlgorithmVersion":"",
/*optional, string, read-only, fingerprint algorithm library version*/
"cardReaderVersion":""
/*optional, string, read-only, card reader version*/
## }
## }
6.1.79 JSON_CardReaderPlan
CardReaderPlan message in JSON format
## {
"CardReaderPlan": {
"templateNo":
/required, integer, schedule template No.: 0-cancel linking the template to the schedule and restore to the default
status (normal status)*/
## }
## }
## 6.1.80
JSON_ClearAntiSneak
ClearAntiSneak message in JSON format
## {
"ClearAntiSneak": {
"clearAll": ,
/*required, boolean, whether to clear all anti-passing back records: "true"-yes, "false"-no. Clearing all anti-passing
back records is not supported by access control devices version 2.1*/
"EmployeeNoList" : [{
Intelligent Security API (Access Control on Person) Developer Guide
## 257

/*optional, person ID list, this node is valid when clearAll is "false". For access control devices version 2.1, if this node
is not configured, failure response message will be returned*/
"employeeNo":""
/*optional, string, employee No. (person ID)*/
## }]
## }
## }
6.1.81 JSON_ClearAntiSneakCfg
ClearAntiSneakCfg message in JSON format
## {
"ClearAntiSneakCfg":{
"ClearFlags":{
"antiSneak":
/*required, boolean, whether to clear the anti-passing back parameters*/
## }
## }
## }
6.1.82 JSON_ClearEventCardLinkageCfg
ClearEventCardLinkageCfg message in JSON format
## {
"ClearEventCardLinkageCfg":{
"ClearFlags":{
"eventCardLinkage":
/*required, boolean, whether to clear event and card linkage parameters: "true"-yes, "false"-no*/
## }
## }
## }
6.1.83 JSON_ClearGroupCfg
ClearGroupCfg message in JSON format
## {
"ClearGroupCfg":{
"ClearFlags":{
"groupCfg":
/*required, boolean, group parameters*/
## }
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 258

6.1.84 JSON_ClearPlansCfg
ClearPlansCfg message in JSON format
## {
"ClearPlansCfg":{
"ClearFlags":{
"doorStatusWeekPlan": ,
/*optional, boolean, whether to clear the week schedule of the door control: "true"-yes, "false"-no*/
"cardReaderWeekPlan": ,
/*optional, boolean, whether to clear the week schedule of the card reader authentication mode control: "true"-yes,
## "false"-no*/
"userRightWeekPlan": ,
/*optional, boolean, whether to clear the week schedule of the access permission control: "true"-yes, "false"-no*/
"doorStatusHolidayPlan": ,
/*optional, boolean, whether to clear the holiday schedule of the door control: "true"-yes, "false"-no*/
"cardReaderHolidayPlan": ,
/*optional, boolean, whether to clear the holiday schedule of the card reader authentication mode control: "true"-
yes, "false"-no*/
"userRightHolidayPlan": ,
/*optional, boolean, whether to clear the holiday schedule of the access permission control: "true"-yes, "false"-no*/
"doorStatusHolidayGroup": ,
/*optional, boolean, whether to clear the holiday group of the door control: "true"-yes, "false"-no*/
"cardReaderHolidayGroup": ,
/*optional, boolean, whether to clear the holiday group of the card reader authentication mode control: "true"-yes,
## "false"-no*/
"userRightHolidayGroup": ,
/*optional, boolean, whether to clear the holiday group of the access permission control: "true"-yes, "false"-no*/
"doorStatusTemplate": ,
/*optional, boolean, whether to clear the schedule template of the door control: "true"-yes, "false"-no*/
"cardReaderTemplate": ,
/*optional, boolean, whether to clear the control schedule template of card reader authentication mode: "true"-yes,
## "false"-no*/
"userRightTemplate":
/*optional, boolean, whether to clear the schedule template of access permission control: "true"-yes, "false"-no*/
## }
## }
## }
6.1.85 JSON_ControlAlarmChan
ControlAlarmChan message in JSON format
## {
"ControlAlarmChan":{
"assiciateAlarmIn":
/*require, array, zone channels and status: 0-disarm, 1-arm. For example, [0,1,0,1] indicates disarming zone No. 1,
arming zone No. 2, disarming zone No. 3, and arming zone No. 4*/
Intelligent Security API (Access Control on Person) Developer Guide
## 259

## }
## }
6.1.86 JSON_CreateFPLibCond
Message about the conditions of creating face picture library, and it is in JSON format.
## {
"faceLibType": "",
/*required, string type, face picture library type: "infraredFD"-infrared face picture library, "blackFD"-list library,
"staticFD"-static library, the maximum size is 32 bytes*/
## "name": "",
/*required, string type, face picture library name, it cannot be duplicated, the maximum size is 48 bytes*/
"customInfo": "",
/*optional, string type, custom information, it is used to indicate the data property or uniqueness, the maximum size
is 192 bytes*/
## }
6.1.87 JSON_CreateFPLibResult
Message about the results of creating face picture library, and it is in JSON format.
## {
"requestURL": "",
"statusCode": "",
"statusString": "",
"subStatusCode": "",
"errorCode": "",
"errorMsg": "",
/*see the description of this node and above nodes in the message of JSON_ResponseStatus*/
## "FDID": ""
/*optional, string type, returned face picture library ID when it created, the library ID of the same type is unique, the
maximum length is 63 bytes. This node is valid when errorCode is 1 and errorMsg is "ok"*/
## }
## See Also
JSON_ResponseStatus
6.1.88 JSON_DelFaceRecord
Message about the parameters of
deleting face records, and it is in JSON format.
## {
## "FPID":[
/*array, list of face record ID, it is the same as the employee No. (person ID). Deleting multiple face records in a batch
is supported*/
## {
Intelligent Security API (Access Control on Person) Developer Guide
## 260

## "value":""
/*required, string type, face record ID, the maximum length is 63 bytes*/
## }
## ]
## }
6.1.89 JSON_DoorStatusHolidayGroupCfg
DoorStatusHolidayGroupCfg message in JSON format
## {
"DoorStatusHolidayGroupCfg": {
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"groupName": "",
/*required, string, holiday group name*/
"holidayPlanNo" : ""
/*required, string, holiday group schedule No.*/
## }
## }
6.1.90 JSON_DoorStatusHolidayPlanCfg
DoorStatusHolidayPlanCfg message in JSON format
## {
"DoorStatusHolidayPlanCfg":{
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"beginDate":"",
/*required, start date of the holiday*/
"endDate":"",
/*required, end data of the holiday*/
"HolidayPlanCfg":[{
/*required, holiday schedule parameters*/
## "id": ,
/required, integer, time period No., which is between 1 and 8*/
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"doorStatus":"",
/*required, string, door status: "remainOpen"-remain open (access without authentication), "remainClosed"-remain
closed (access is not allowed), "normal"-access by authentication, "sleep", "invalid"*/
"TimeSegment":{
"beginTime":"",
/*required, start time of the time period (device local time)*/
"endTime":""
/*required, end time of the time period (device local time)*/
## }
## }]
Intelligent Security API (Access Control on Person) Developer Guide
## 261

## }
## }
6.1.91 JSON_DoorStatusPlan
DoorStatusPlan message in JSON format
## {
"DoorStatusPlan": {
"templateNo":
/*required, integer, schedule template No.: 0-cancel linking the template with the schedule and restore to the default
status (normal status)*/
## }
## }
6.1.92 JSON_DoorStatusPlanTemplate
DoorStatusPlanTemplate message in JSON format
## {
"DoorStatusPlanTemplate": {
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"templateName": "",
/*required, string, template name*/
"weekPlanNo" : ,
/*required, integer, week schedule No.*/
"holidayGroupNo" : ""
/*required, string, holiday group No.*/
## }
## }
6.1.93 JSON_DoorStatusWeekPlanCfg
DoorStatusWeekPlanCfg message in JSON format
## {
"DoorStatusWeekPlanCfg":{
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"WeekPlanCfg":[{
/*required, week schedule parameters*/
## "week":"",
/*required, string, days of the week: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
"Sunday"*/
## "id": ,
/*required, integer, time period No., which is between 1 and 8*/
Intelligent Security API (Access Control on Person) Developer Guide
## 262

## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"doorStatus":"",
/*required, sting, door status: "remainOpen"-remain open (access without authentication), "remainClosed"-remain
closed (access is not allowed), "normal"-access by authentication, "sleep", "invalid"*/
"TimeSegment":{
"beginTime":"",
/*required, start time of the time period (device local time)*/
"endTime":""
/*required, end time of the time period (device local time)*/
## }
## }]
## }
## }
6.1.94 JSON_EditFaceRecord
Message about the editing information of face record, and it is in JSON format.
## {
"faceURL": "",
/*optional, face picture URL, string type, the maximum size is 256 bytes*/
## "name": "",
/*required, name of person in the face picture, string type, the maximum size is 96 bytes*/
## "gender": "",
/*optional, gender of person in the face picture: male, female, unknown, string type, the maximum size is 32 bytes*/
"bornTime": "",
/*required, birthday of person in the face picture, ISO8601 time format, string type, the maximum size is 20 bytes*/
## "city": "",
/*optional, city code of birth for the person in the face picture, string type, the maximum size is 32 bytes*/
"certificateType": "",
/*optional, string type, the maximum size is 10 bytes, certificate type: "officerID"-officer ID, "ID"-identify card,
passport, other*/
"certificateNumber": "",
/*optional, certificate No., string, the maximum size is 32 bytes*/
"caseInfo": "",
/*optional, case information, string type, the maximum size is 192 bytes, it is valid when faceLibType is blackFD*/
## "tag": "",
/*optional, custom tag, up to 4 tags, which are separated by commas, string type, the maximum size is 195 bytes. It is
valid when faceLibType is blackFD*/
## "address": "",
/*optional, person address, string type, the maximum size is 192 bytes, it is valid when faceLibType is staticFD.*/
"customInfo": "",
/*optional, custom information, string type, the maximum size is 192 bytes, it is valid when faceLibType is staticFD.*/
"modelData":""
/*optional, string type, target model data, non-modeled binary data needs to be encrypted by base64 during
transmission*/
"rowKey ":"",
/*optional, string type, face picture library main key. Search by rowKey can be more efficient, the maximum size is 64
bytes*/
## "transfer":true
Intelligent Security API (Access Control on Person) Developer Guide
## 263

/*optional, boolean type, whether to enable transfer*/
## }
6.1.95 JSON_EditFPlibInfo
Message about the editing information of face picture library, and it is in JSON format.
## {
## "name": "",
/*optional, face picture library name, string type, the max. string length is 48 bytes*/
"customInfo": ""
/*optional, custom information, it is used to indicate the data property or uniqueness, string type, the max. string
length is 192 bytes*/
## }
6.1.96 JSON_EventCardLinkageCfg
EventCardLinkageCfg message in JSON format
## {
"EventCardLinkageCfg": {
"proMode": "",
/*required, string, linkage type: "event"-event linkage, "card"-card linkage, "mac"-MAC address linkage, "employee"-
employee No. (person ID)*/
"EventLinkageInfo":{
/*optional, event linage parameters, it is valid when proMode is "event"*/
"mainEventType": ,
/*optional, integer, major event type: 0-device event, 1-alarm input event, 2-access control point event, 3-
authentication unit (card reader, fingerprint module) event*/
"subEventType":
/*optional, integer, minor event type, refer to Event Linkage Types for details*/
## },
"CardNoLinkageInfo": {
/*optional, card linkage parameters, it is valid when proMode is "card"*/
"cardNo": ""
/*optional, string, card No.*/
## },
"MacAddrLinkageInfo": {
/*optional, MAC address linkage parameters, it is valid when proMode is "mac"*/
"MACAddr": ""
/*optional, string, physical MAC address*/
## },
"EmployeeInfo": {
/*optional, employee No. (person ID) linkage parameters, it is valid when proMode is "employee"*/
"employeeNo":""
/*optional, string, employee No. (person ID)*/
## },
"eventSourceID": ,
/*optional, integer, event source ID, it is valid when proMode is "event", 65535-all. For device event (mainEventType
Intelligent Security API (Access Control on Person) Developer Guide
## 264

is 0), this field is invalid; for access control point event (mainEventType is 2), this field refers to the access control
point No.; for authentication unit event (mainEventType is 3, this field refers to the authentication unit No.; for alarm
input event (mainEventType is 1), this field refers to the zone alarm input ID or the event alarm input ID*/
## "alarmout": ,
/*optional, array, linked alarm output No., e.g., [1,3,5]: 1-linked alarm output No.1; 3-linked alarm output No.3; 5-
linked alarm output No.5*/
"openDoor": ,
/*optional, array, linked door No. to open, e.g., [1,3,5]: 1-linked door No.1; 3-linked door No.3; 5-linked door No.5*/
"closeDoor": ,
/*optional, array, linked door No. to close, e.g., [1,3,5]: 1-linked door No.1; 3-linked door No.3; 5-linked door No.5*/
"alwaysOpen": ,
/*optional, array, linked door No. to remain unlocked, e.g., [1,3,5]: 1-linked door No.1; 3-linked door No.3; 5-linked
door No.5*/
"alwaysClose": ,
/*optional, array, linked door No. to remain locked, e.g., [1,3,5]: 1-linked door No.1; 3-linked door No.3; 5-linked door
## No.5*/
"mainDevBuzzer": ,
/*optional, boolean, whether to enable buzzer linkage of the access controller (start buzzing): "false"-no, "true"-yes*/
"capturePic": ,
/*optional, boolean, whether to enable capture linkage: "false"-no, "true"-yes*/
"recordVideo": ,
/*optional, boolean, whether to enable recording linkage: "false"-no, "true"-yes*/
"mainDevStopBuzzer": ,
/*optional, boolean, whether to enable buzzer linkage of access controller (stop buzzing): "false"-no, "true"-yes*/
"audioDisplayID": ,
/*optional, integer, linked audio announcement ID, which is between 1 and 32: 0-not link*/
"audioDisplayMode": "",
/*optional, integer, linked audio announcement mode: "close", "single", "loop"*/
"readerBuzzer": ,
/*optional, array, linked buzzer No., e.g, [1,3,5]: 1-buzzer No.1, 3-buzzer No.3, 5-buzzer No.5*/
"alarmOutClose": ,
/*optional, array, linked alarm output No. to disable, e.g, [1,3,5]: 1-alarm output No.1, 3-alarm output No.3, 5-alarm
output No.5*/
"alarmInSetup": ,
/*optional, array, linked zone No. to arm, e.g, [1,3,5]: 1-zone No.1, 3-zone No.3, 5-zone No.5*/
"alarmInClose": ,
/*optional, array, linked zone No. to disarm, e.g, [1,3,5]: 1-zone No.1, 3-zone No.3, 5-zone No.5*/
"readerStopBuzzer": ,
/*optional, array, linked buzzer No. to stop buzzing, e.g, [1,3,5]: 1-buzzer No.1, 3-buzzer No.3, 5-buzzer No.*/
## }
## }
## See Also
## Event Linkage Types
6.1.97 JSON_EventCardNoList
EventCardNoList message in JSON format
Intelligent Security API (Access Control on Person) Developer Guide
## 265

## {
"EventCardNoList":{
## "id":
/*required, array, list of configured event and card linkage ID, e.g., [1,2,3] indicates that the device is configured with
event linkage 1, 2, and 3*/
## }
## }
6.1.98 JSON_EventNotificationAlert_AccessControlEventEg
The access control event information is uploaded with pictures in the JSON format of
EventNotificationAlert message.
## With Picture
Content-Type:multipart/form-data;boundary=MIME_boundary
--MIME_boundary
Content-Type: application/json
Content-Length:480
## {
"ipAddress": "172.6.64.7",
"ipv6Address": "",
"portNo": 80,
"protocol": "HTTP",
"macAddress": "01:17:24:45:D9:F4",
"channelID": "1",
"dateTime": "2016-12-12T17:30:08+08:00",
"activePostCount": 1,
"eventType": "AccessControllerEvent",
"eventState": "active",
"eventDescription": "Access Controller Event",
"AccessControllerEvent":{
"deviceName": "",
"majorEventType": ,
"subEventType": ,
"netUser": "",
"remoteHostAddr": "",
"cardNo": "",
"cardType": ,
"whiteListNo": ,
"reportChannel": ,
"cardReaderKind": ,
"cardReaderNo": ,
"doorNo": ,
"verifyNo": ,
"alarmInNo": ,
"alarmOutNo": ,
"caseSensorNo": ,
"RS485No": ,
"multiCardGroupNo": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 266

"accessChannel": ,
"deviceNo": ,
"distractControlNo": ,
"employeeNo": ,
"employeeNoString": "",
"localControllerID": ,
"InternetAccess": ,
## "type": ,
"MACAddr": "",
"swipeCardType": ,
"serialNo": ,
"channelControllerID": ,
"channelControllerLampID": ,
"channelControllerIRAdaptorID": ,
"channelControllerIREmitterID": ,
"userType": "normal",
"currentVerifyMode": ,
"currentEvent": ,
"frontSerialNo": ,
"attendanceStatus":"",
"statusValue": ,
"pictureURL": "",
"picturesNumber": ,
"purePwdVerifyEnable":
## }
## }
--MIME_boundary
Content-Disposition: form-data; name="CapturePicture";
Content-Type:image/jpeg
Content-Length:12345
fgagasghshgshdasdad...
--MIME_boundary--
## Node Description
deviceName
Optional, string, device name.
majorEventType
Required, integer, alarm/event major types (the type value should be transformed to decimal),
see Access Control Event Types for details.
subEventType
Required, integer, alarm/event minor types (the type value should be transformed to decimal),
see Access Control Event Types for details.
netUser
Optional, string, user name for network operations.
remoteHostAddr
Intelligent Security API (Access Control on Person) Developer Guide
## 267

Optional, string, remote host address.
cardNo
Optional. string, card No.
cardType
Optional, integer, card types: "1"-normal card, "2"-disabled card, "3"-blacklist card, "4"-patrol
card, "5"-druess card, "6"-super card, "7"-visitor card, "8"-dismiss card.
whiteListNo
Optional, integer, whitelist No., which is between 1 and 8.
reportChannel
Optional, integer, alarm/event uploading channel types: "1"-for uploading arming information,
"2"-for uploading by central group 1, "3"-for uploading by central group 2.
cardReaderKind
Optional, integer, verification unit types: "1"-IC card reader, "2"-ID card reader, "3"-QR code
scanner, "4"-fingerprint module.
cardReaderNo
Optional, integer, verification unit No.
doorNo
Optional, integer, door or floor No.
verifyNo
Optional, integer, multiple authentication No.
alarmInNo
Optional, integer, alarm input No.
alarmOutNo
Optional, integer, alarm output No.
caseSensorNo
Optional, integer, event trigger No.
RS485No
Optional, integer, RS485 channel No.
multiCardGroupNo
Optional, integer, group No.
accessChannel
Optional, integer, access lane No.
deviceNo
Optional, integer, device No.
distractControlNo
Intelligent Security API (Access Control on Person) Developer Guide
## 268

Optional, integer, distributed access controller No.
employeeNo
Optional, integer, employee No. (person ID)
employeeNoString
Optional, string, employee No. (person ID). If the node employeeNo exists, this node
employeeNoString is required. For platform or client software, the node employeeNoString will
be parsed in prior.
localControllerID
Optional, integer, distributed access controller No.: "0"-access controller, "1" to "64"-distributed
access controller No.1 to distributed access controller No.64
InternetAccess
Optional, integer, network interface No.: "1"-upstream network interface No.1, "2"-upstream
network interface No.2, "3"-downstream network interface No.1
type
Optional, integer, zone types: "0"-instant alarm zone, "1"-24-hour alarm zone, "2"-delayed zone,
"3"-internal zone, "4"-key zone,
"5"-fire alarm zone, "6"-perimeter protection, "7"-24-hour
slient alarm zone, "8"-24-hour auxiliary zone, "9"-24-hour shock alarm zone, "10"-emergency
door open alarm zone, "11"-emergency door closed alarm zone, "255"-none.
MACAddr
Optional, string, physical address
swipeCardType
Optional, integer, card swiping types: "0"-invalid, "1"-QR code
serialNo
Optional, integer, event serial No., which is used to judge whether the event loss occurred.
channelControllerID
Optional, integer, lane controller No.: "1"-master lane controller, "2"-slave lane controller
channelControllerLampID
Optional, integer, light board No. of lane controller, which is between 1 and 255.
channelControllerIRAdaptorID
Optional, integer, IR adaptor No. of lane controller, which is between 1 and 255.
channelControllerIREmitterID
Optional, integer, active infrared intrusion detector No. of lane controller, which is between 1
and 255.
userType
Optional, string, person types: "normal"-resident, "visitor"-visitor, "blacklist"-person in blacklist,
## "administrators"-administrator.
Intelligent Security API (Access Control on Person) Developer Guide
## 269

currentVerifyMode
Optional, string, authentication modes: "cardAndPw"-card+password, "card"-card, "cardOrPw"-
card or password,
"fp"-fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or
card, "fpAndCard"-fingerprint+card, "fpAndCardAndPw"-fingerprint+card+password,
"faceOrFpOrCardOrPw"-face or fingerprint or card or password, "faceAndFp"-face+fingerprint,
"faceAndPw"-face+password, "faceAndCard"-face+card, "face"-face, "employeeNoAndPw"-
employee No.+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee
No.+fingerprint, "employeeNoAndFpAndPw"-employee No.+fingerprint+password,
"faceAndFpAndCard"-face+fingerprint+card, "faceAndPwAndFp"-face+password+fingerprint,
"employeeNoAndFace"-employee No.+face, "faceOrfaceAndCard"-face or face+card,
"fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password, "cardOrFace"-card
or face, "cardOrFaceOrFp"-card or face or fingerprint, "cardOrFpOrPw"-card or fingerprint or
password.
currentEvent
Optional, boolean, whether to be a real-time event: "true"-yes (real-time event), "false"-no
(offline event).
frontSerialNo
Optional, integer, previous event serial No. If this node does not exits, the platform will judge
whether the event loss occurred according to the node serialNo. If both theserialNo and
frontSerialNo, the
platform will judge according to the two nodes together.
attendanceStatus
Optional, string, attendance status: "undefined", "checkIn"-check in, "checkOut"-check out,
"breakOut"-break out, "breakIn"-break in,
"overtimeIn"-overtime in, "overTimeOut"-overtime
out.
statusValue
Optional, integer, status value.
pictureURL
Optional, string, picture URL.
picturesNumber
Optional, integer, number of captured pictures if the capture linkage action is configured. This
node will be 0 or not be returned if there is no picture.
purePwdVerifyEnable
Optional, boolean, whether the device supports opening the door only by password: true-yes,
this node is not returned-no. The password used to open the door is the value of the node
password in the message JSON_UserInfo .
For opening the door only by password: 1. The password in "XXX or password" in the
authentication mode refers to the person's password (the value of the node password in
JSON_UserInfo ); 2. The device will not check the
duplication of the password, and the upper
Intelligent Security API (Access Control on Person) Developer Guide
## 270

platform should ensure that the password is unique; 3. The password cannot be added, deleted,
edited, or searched for on the device locally.
## Example
Interaction Example of Uploading Access Control Event in Arming Mode
## HTTP/1.1 200 OK
MIME-Version: 1.0
Connection: close
Content-Type:multipart/form-data;boundary=MIME_boundary
--MIME_boundary
Content-Type: application/json
Content-Length:480
<alarm message in JSON format>
--MIME_boundary
Content-Disposition: form-data; name="Picture"; filename="Picture.jpg"
Content-Type:image/jpeg
Content-Length:516876
fefefwageegfqaeg...
--MIME_boundary
Content-Type: application/json
Content-Length:480
<next alarm message in JSON format>
--MIME_boundary
Content-Disposition: form-data; name="Picture"; filename="Picture.jpg"
Content-Type:image/jpeg
Content-Length:516876
fefefwageegfqaeg...
## 6.1.99
JSON_EventNotificationAlert_Alarm/EventInfo
EventNotificationAlert message with alarm or event information in JSON format.
## {
"ipAddress": "",
/*required, device IPv4 address , string, the maximum size is 32 bytes*/
"ipv6Address": "",
/*optional, device IPv6 address, string, the maximum size is 128 bytes*/
"portNo": ,
/*optional, device port No., integer32*/
## "protocol": "",
/*optional, protocol type, "HTTP, HTTPS", string, the maximum size is 32 bytes*/
"macAddress": "",
/*optional, MAC address, string, the maximum size is 32 bytes, e.g., 01:17:24:45:D9:F4*/
"channelID": "",
Intelligent Security API (Access Control on Person) Developer Guide
## 271

/*optional, device channel No., integer32*/
"dateTime": "",
/*optional, string, alarm/event triggered or occurred time based on ISO8601, the maximum size is 32 bytes, e.g.,
## 2009-11-14T15:27Z*/
"activePostCount": "",
/*required, alarm/event frequency, integer32*/
"eventType": "",
/*required, alarm/event type, "captureResult, faceCapture,...", string, the maximum size is 128 bytes*/
"eventState": "",
/*required, string, the maximum size is 32 bytes, durative alarm/event status: "active"-valid, "inactive"-invalid*/
"eventDescription": "",
/*required, event description, string, the maximum size is 128 bytes*/
"deviceID":"",
/*string type, device ID*/
## "uuid":"",
/*string type, event UUID, which is used to uniquely identify an event, the standard UUID format is xxxxxxxx-xxxx-xxxx-
xxxx-xxxxxxxxxxxx*/
## ...
/*optional, for different alarm/event types, the nodes are different, see the message examples in different
applications*/
## }
## 6.1.100
JSON_EventNotificationAlert_UploadIDCardSwipingEvent
The event information of swiping ID card is uploaded in the JSON format of EventNotificationAlert
message.
## {
"ipAddress":"",
/*required, string type, IPv4 address of the alarm device, the maximum length is 32 bytes*/
"ipv6Address":"",
/*required, string type, IPv6 address of the alarm device, the maximum length is 128 bytes*/
"portNo": ,
/*optional, integer32 type, port No. of the alarm device*/
## "protocol":"",
/*optional, string type, protocol type: "HTTP", "HTTPS", the maximum length is 32 bytes*/
"macAddress":"",
/*optional, string type, MAC address, the maximum length is 32 bytes*/
"channelID":"",
/*optional, integer32 type, device channel No. that triggers alarm*/
"dateTime":"",
/*required, string type, alarm triggering
time (UTC time), the maximum length is 32 bytes*/
"activePostCount": ,
/*required, integer32 type, times that the same alarm has been uploaded*/
"eventType":"",
/*required, string type, triggered event type: "IDCardInfoEvent"-ID card swiping event, the maximum length is 128
bytes*/
"eventState":"",
/*required, string type, event triggering status: "active"-triggered, "inactive"-not triggered, the maximum length is 32
bytes*/
Intelligent Security API (Access Control on Person) Developer Guide
## 272

"eventDescription":"",
/*required, event description*/
"IDCardInfoEvent":{
"deviceName":"",
/*optional, string type, device name*/
"majorEventType": ,
/*required, integer type, major alarm type, the type value should be transformed to decimal, refer to Access Control
Event Types for details*/
"subEventType": ,
/*required, integer type, minor alarm type, the type value should be transformed to decimal, refer to Access Control
Event Types for details*/
"inductiveEventType":"",
/*optional, string type, inductive event type*/
"netUser":"",
/*optional, string type, user name for network operations*/
"remoteHostAddr":"",
/*optional, string type, remote host address*/
"cardType": ,
/*optional, integer type, card type: 1-normal card, 2-disabled card, 3-blacklist card, 4-patrol card, 5-duress card, 6-
super card, 7-visitor card, 8-dismiss card*/
"cardReaderNo": ,
/*optional, integer type, card reader No.*/
"doorNo": ,
/*optional, integer type, door No. (floor No.)*/
"deviceNo": ,
/*optional, integer type, device No.*/
"serialNo": ,
/*optional, integer type, event serial No.*/
"currentEvent": ,
/*optional, boolean type, whether it is a real-time event: "true"-yes (real-time event), "false"-no (offline event)*/
"frontSerialNo": ,
/*optional, integer, previous event serial No. If this node does not exist, the platform will check whether the event is
lost according to the node serialNo. If the frontSerialNo is returned, the platform will check according to the serialNo
and frontSerialNo together*/
"IDCardInfo":{
## "name":"",
/*optional, string type, name*/
## "sex":"",
/*optional, string type, gender: "male", "female"*/
## "birth":"",
/*optional, string type, date of birth, e.g., 1990-02-24*/
## "addr":"",
/*optional, string type, address*/
"IDCardNo":"",
/*optional, string type, ID card No.*/
"issuingAuthority":"",
/*optional, string type, authority*/
"startDate":"",
/*optional, string type, start date of the effective period*/
"endDate":"",
/*optional, string type, end date of the effective period*/
## "nation": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 273

## /*reserved*/
"isLongTermEffective":
/*optional, boolean type, whether the effective period is permanent*/
## },
"pictureURL":"",
/*optional, string type, captured picture URL*/
"IDCardPicURL":"",
/*optional, string type, ID card picture URL*/
"picturesNumber":
/*optional, integer type, number of pictures. If there is no picture, this node is set to 0 or is not returned*/
## }
## }
## See Also
## Access Control Event Types
## Example
Interaction Example of Uploading ID Card Swiping Event in Arming Mode
## HTTP/1.1 200 OK
MIME-Version: 1.0
Connection: close
Content-Type:multipart/form-data;boundary=MIME_boundary
--MIME_boundary
Content-Type: application/json
Content-Length:480
<alarm message in JSON format>
--MIME_boundary
Content-Disposition: form-data; name="Picture"; filename="Picture.jpg"
Content-Type:image/jpeg
Content-Length:516876
fefefwageegfqaeg...
--MIME_boundary
Content-Disposition: form-data; name="IDCardPic"; filename="IDCardPic.jpg"
Content-Type:image/jpeg
Content-Length:516876
fefefwageegfqaeg...
--MIME_boundary
Content-Type: application/json
Content-Length:480
<next alarm message in JSON format>
--MIME_boundary
Content-Disposition: form-data; name="Picture"; filename="Picture.jpg"
Content-Type:image/jpeg
Content-Length:516876
fefefwageegfqaeg...
Intelligent Security API (Access Control on Person) Developer Guide
## 274

--MIME_boundary
Content-Disposition: form-data; name="IDCardPic"; filename="IDCardPic.jpg"
Content-Type:image/jpeg
Content-Length:516876
fefefwageegfqaeg...
--MIME_boundary
6.1.101 JSON_EventOptimizationCfg
EventOptimizationCfg message in JSON format
## {
"EventOptimizationCfg":{
## "enable": ,
/*optional, boolean, whether to enable event optimization: true-yes (default), false-no*/
"isCombinedLinkageEvents":
/*optional, boolean, whether to enable linked event combination: true-enable (default), false-disable*/
## }
## }
6.1.102 JSON_FaceRecognizeMode
FaceRecognizeMode message in JSON format
## {
"FaceRecognizeMode":{
/*required, facial recognition mode: "normalMode"-normal mode, "deepMode"-deep mode*/
## "mode":""
## }
## }
6.1.103 JSON_FaceRecordNumInAllFPLib
Message about the total number of face records in all face picture libraries, and it is in JSON
format.
## {
"requestURL": "",
"statusCode": "",
"statusString": "",
"subStatusCode": "",
"errorCode": "",
"errorMsg": "",
/*see the description of this node and above nodes in the message of JSON_ResponseStatus*/
"FDRecordDataInfo":[{
/*optional, string type, information of face records in face picture library, this node is valid when errorCode is 1 and
Intelligent Security API (Access Control on Person) Developer Guide
## 275

errorMsg is "ok"*/
## "FDID": "",
/*optional, face picture library ID, string type, the maximum size is 63 bytes*/
"faceLibType": "",
/*optional, face picture library type: "blackFD"-list library, "staticFD"-static library, string type, the maximum size is 32
bytes*/
## "name": "",
/*optional, face picture library name, string type, the maximum size is 48 bytes*/
"recordDataNumber": ""
/*optional, number of records, integer32 type*/
## }]
## }
## See Also
JSON_ResponseStatus
6.1.104 JSON_FaceRecordNumInOneFPLib
Message about the number of face records in a specific face picture library, and it is in JSON
format.
## {
"requestURL": "",
"statusCode": "",
"statusString": "",
"subStatusCode": "",
"errorCode": "",
"errorMsg": "",
/*see the description of this node and above nodes in the message of JSON_ResponseStatus*/
## "FDID": "",
/*optional, face picture library ID, string type, the max. string length is 63 bytes*/
"faceLibType": "",
/*optional, face picture library type: "blackFD"-list library, "staticFD"-static library, string type, the max. string length is
32 bytes*/
## "name": "",
/*optional, face picture library name, string type, the max. string length is 48 bytes*/
"recordDataNumber": ""
/*optional, number of records, integer32 type*/
## }
## See Also
JSON_ResponseStatus
6.1.105 JSON_FingerPrintCfg
FingerPrintCfg message in JSON format
Intelligent Security API (Access Control on Person) Developer Guide
## 276

## {
"FingerPrintCfg":{
"employeeNo":"",
/*required, string, employee No. (person ID) linked with the fingerprint*/
"enableCardReader": ,
/*required, array, fingerprint modules to apply fingerprint data to, e.g., [1,3,5] indicates applying fingerprint data to
fingerprint modules No.1, No.3, and No.5*/
"fingerPrintID": ,
/*required, integer, fingerprint No., which is between 1 and 10*/
"deleteFingerPrint": ,
/*optional, boolean, whether to delete the fingerprint: "true"-yes. This node is required only when the fingerprint
needs to be deleted; for adding or editing fingerprint information, this node can be set to NULL*/
"fingerType":"",
/*required, string, fingerprint type: "normalFP"-normal fingerprint, "hijackFP"-duress fingerprint, "patrolFP"-patrol
fingerprint, "superFP"-super fingerprint, "dismissingFP"-dismiss fingerprint*/
"fingerData":"",
/*required, string, fingerprint data encoded by Base64*/
"leaderFP": ,
/*optional, array, whether the access control points support first fingerprint authentication function, e.g., [1,3,5]
indicates that access control points No.1, No.3, and No.5 support first fingerprint authentication function*/
"checkEmployeeNo":
/*optional, boolean, whether to check the existence of the employee No. (person ID): "false"-no, "true"-yes. If this
node is not configured, the device will check the existence of the employee No. (person ID) by default. If this node is
set to "false", the device will not check the existence of the employee No. (person ID) to speed up data applying; if this
node is set to "true" or NULL, the device will check the existence of the employee No. (person ID), and it is
recommended to set this node to "true" or NULL if there is no need to speed up data applying*/
## }
## }
6.1.106 JSON_FingerPrintCond
FingerPrintCond message in JSON format
## {
"FingerPrintCond":{
"searchID":"",
/*required, string, search ID, which is used to confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
"employeeNo":"",
/*required, string, employee No. (person ID) linked with the fingerprint*/
"cardReaderNo": ,
/*optional, integer, fingerprint module No.*/
"fingerPrintID":
/*optional, integer, fingerprint No., which is between 1 and 10*/
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 277

6.1.107 JSON_FingerPrintCondAll
FingerPrintCondAll message in JSON format.
## {
"FingerPrintCondAll": {
"employeeNo": ,
/*required, integer, employee ID (person ID), which is linked with the fingerprint*/
"cardReaderNo":
/*required, integer, fingerprint module No.*/
## }
## }
6.1.108 JSON_FingerPrintDelete
FingerPrintDelete message in JSON format
## {
"FingerPrintDelete":{
## "mode":"",
/*required, string,
deleting mode: "byEmployeeNo"-delete by employee No. (person ID), "byCardReader"-delete by
fingerprint module*/
"EmployeeNoDetail":{
/*optional, delete by employee No. (person ID), this node is valid when mode is "byEmployeeNo"*/
"employeeNo":"",
/*optional, string, employee No. (person ID) linked with the fingerprint*/
"enableCardReader": ,
/*optional, array, fingerprint module whose fingerprints should be deleted, e.g., [1,3,5] indicates that the fingerprints
of fingerprint modules No.1, No.3, and No.5 are deleted*/
"fingerPrintID":
/*optional, array, No. of fingerprint to be deleted, e.g., [1,3,5] indicates deleting fingerprint No.1, No.3, and No.5*/
## },
"CardReaderDetail":{
/*optional, delete by fingerprint module, this node is valid when mode is "byCardReader"*/
"cardReaderNo": ,
/*optional, integer, fingerprint module No.*/
"clearAllCard": ,
/*optional, boolean, whether to delete the fingerprint information of all cards: "false"-no (delete by employee No.),
"true"-yes (delete the fingerprint information of all employee No.)*/
"employeeNo":""
/*optional, string, employee No. (person ID) linked with the fingerprint, this node is valid when clearAllCard is
## "false"*/
## }
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 278

6.1.109 JSON_FingerPrintDeleteProcess
FingerPrintDeleteProcess message in JSON format
## {
"FingerPrintDeleteProcess":{
## "status":""
/*required, string, deleting status: "processing"-deleting, "success"-deleted, "failed"-deleting failed*/
## }
## }
6.1.110 JSON_FingerPrintInfo
FingerPrintInfo message in JSON format
## {
"FingerPrintInfo":{
"searchID":"",
/*required, string, search ID, which is used to
confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
## "status":"",
/*required, string, status: "OK"-the fingerprint exists, "NoFP"-the fingerprint does not exist*/
"FingerPrintList":[{
"cardReaderNo": ,
/*required, integer, fingerprint module No.*/
"fingerPrintID": ,
/*required, integer, fingerprint No., which is between 1 and 10*/
"fingerType":"",
/*required, string, fingerprint type: "normalFP"-normal fingerprint, "hijackFP"-duress fingerprint, "patrolFP"-patrol
fingerprint, "superFP"-super fingerprint, "dismissingFP"-dismiss fingerprint*/
"fingerData":"",
/*required, string, fingerprint data encoded by Base64*/
"leaderFP":
/*optional, array, whether the access control points support first fingerprint authentication function, e.g., [1,3,5]
indicates that access control points No.1, No.3, and No.5 support first fingerprint authentication function*/
## }]
## }
## }
6.1.111 JSON_FingerPrintInfoAll
FingerPrintInfoAll message in JSON format.
## {
"FingerPrintInfoAll": {
"FingerPrintList": [
## {
Intelligent Security API (Access Control on Person) Developer Guide
## 279

"fingerPrintID": ,
/*required, integer, fingerprint No., which is between 1 and 10*/
"fingerType": "",
/*required, string, fingerprint type: "normalFP"-normal fingerprint, "hijackFP"-duress fingerprint, "patrolFP"-patrol
fingerprint, "superFP"-super fingerprint, "dismissingFP"-dismiss fingerprint*/
"leaderFP": ,
/*optional, array, whether the access control points support first fingerprint authentication function, e.g., [1,3,5],
access control point No.1, No.3, and No.5 support first fingerprint authentication function*/
"picEnable": ,
/*optional, boolean, whether contains fingerprint data*/
## }],
"picturesNumber": ,
/*optional, integer, number of fingerprint, if there is no fingerprint data, this node will be set to 0 or not be returned*/
## }
## }
6.1.112 JSON_FingerPrintModify
FingerPrintModify message in JSON format
## {
"FingerPrintModify":{
"employeeNo":"",
/*required, string, employee No. (person ID) linked with the fingerprint*/
"cardReaderNo": ,
/*required, integer, fingerprint module No.*/
"fingerPrintID": ,
/*required, integer, fingerprint No., which is between 1 and 10*/
"fingerType":"",
/*required, string, fingerprint type: "normalFP"-normal fingerprint, "hijackFP"-duress fingerprint, "patrolFP"-patrol
fingerprint, "superFP"-super fingerprint, "dismissingFP"-dismiss fingerprint. If this node is not configured, the
fingerprint type will be the original type*/
"leaderFP": ,
/*optional, array, whether the access control points support first fingerprint authentication function, e.g., [1,3,5]
indicates that access control points No.1, No.3, and No.5 support first fingerprint authentication function. If this node
is not configured, the first fingerprint authentication function will remain unchanged*/
## }
## }
6.1.113 JSON_FingerPrintStatus
FingerPrintStatus message in JSON format
## {
"FingerPrintStatus":{
## "status":"",
/*optional, string, status: "success", "failed". This node will be returned only when editing fingerprint parameters or
deleting fingerprints; for applying fingerprint data to the fingerprint module, this node will not be returned*/
"StatusList":[{
Intelligent Security API (Access Control on Person) Developer Guide
## 280

/*optional, status list. This node will be returned only when applying fingerprint data to the fingerprint module; for
editing fingerprint parameters or deleting fingerprints, this node will not be returned*/
## "id": ,
/*optional, integer, fingerprint module No.*/
"cardReaderRecvStatus": ,
/*optional, integer, fingerprint module status: 0-connecting failed, 1-connected, 2-the fingerprint module is offline, 3-
the fingerprint quality is poor, try again, 4-the memory is full, 5-the fingerprint already exists, 6-the fingerprint ID
already exists, 7-invalid fingerprint ID, 8-this fingerprint module is already configured, 10-the fingerprint module
version is too old to support the employee No.*/
"errorMsg":"",
/*optional, string, error information*/
## }],
"totalStatus":
/*required, integer, applying status: 0-applying, 1-applied*/
## }
## }
6.1.114 JSON_FPLibCap
Face picture library capability message, and it is in JSON format.
## {
"requestURL":"",
"statusCode": ,
"statusString":"",
"subStatusCode":"",
"errorCode": ,
"errorMsg":" ",
/*see the description of this node and the above nodes in the message of JSON_ResponseStatus*/
"FDNameMaxLen": ,
/*required, integer32 type, maximum length of face picture library name, the default value is 64 bytes*/
"customInfoMaxLen": ,
/*required, integer32 type, maximum length of custom information, the default value is 256 bytes*/
"FDMaxNum": ,
/*required, integer32 type, maximum number of face picture libraries, the default value is 3*/
"FDRecordDataMaxNum": ,
/*required, integer type, maximum face records supported by face picture library*/
"supportFDFunction":"post,delete,put,get,setUp",
/*required, the supported operations on face picture library: "post"-create, "delete"-delete, "put"-edit, "get"-search,
"setUp"-set*/
"isSuportFDSearch": ,
/*required, boolean type, whether supports searching in face picture library: "true"-yes, "false"-no*/
"isSupportFDSearchDataPackage": ,
/*required, boolean type, whether supports packaging the found data in the face picture library: "true"-yes, "false"-
no*/
"isSuportFSsearchByPic": ,
/*required, boolean type, whether supports searching by picture in the face picture library: "true"-yes, "false"-no*/
"isSuportFSsearchByPicGenerate": ,
/*required, boolean type, whether supports exporting search by picture results from the face picture library: "true"-
yes, "false"-no*/
"isSuportFDSearchDuplicate": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 281

/*required, boolean type, whether supports duplication checking: "true"-yes, "false"-no*/
"isSuportFDSearchDuplicateGenerate": ,
/*required, boolean type, whether supports exporting the duplication checking results: "true"-yes, "false"-no*/
"isSuportFCSearch": ,
/*required, boolen type, whether supports searching face picture comparison alarms: "true"-yes, "false"-no*/
"isSupportFCSearchDataPackage": ,
/*required, boolean, whether supports packaging the search results of face picture comparison alarms: "true"-yes,
## "false"-no*/
"isSupportFDExecuteControl": ,
/*required, boolean, whether supports creating relation between face picture libraries and cameras: "true"-yes,
## "false"-no*/
"generateMaxNum": ,
/*required, integer32 type, maximum face records can be exported from face picture library*/
"faceLibType":"blackFD,staticFD,infraredFD",
/*optional, string type, face picture library types: "blackFD"-list library, "staticFD"-static library, "infraredFD"-infrared
face picture library, the maximum size of value can be assigned to this node is 32 bytes*/
"modelMaxNum": ,
/*optional, integer type, the maximum number of search results, the default value is 100*/
"isSupportModelData":true
/*optional, boolean type, whether to support applying model data: "true"-yes, this node is not returned-no*/
## }
## See Also
JSON_ResponseStatus
6.1.115 JSON_FPLibListInfo
Message about the list of face picture libraries, and it is in JSON format.
## {
"requestURL": "",
"statusCode": "",
"statusString": "",
"subStatusCode": "",
"errorCode": "",
"errorMsg": "",
/*see the description of this node and above nodes in the message of JSON_ResponseStatus*/
"FDLib":[
/*optional, face picture library information, string type, this node is valid when errorCode is 1 and errorMsg is "ok"*/
## {
## "FDID": "",
/*optional, face picture library ID, string type, the maximum size is 63 bytes*/
"faceLibType": "",
/*optional, face picture library type: "blackFD"-list library, "staticFD"-static library, string type, the maximum size is 32
bytes*/
## "name": "",
/*optional, face picture library name, string type, the maximum size is 48 bytes*/
"customInfo": ""
/*optional, custom information, string type, the maximum size is 192 bytes*/
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 282

## ]
## }
## See Also
JSON_ResponseStatus
6.1.116 JSON_GroupCfg
GroupCfg message in JSON format
## {
"GroupCfg":{
## "enable": ,
/*required, boolean, whether to enable the group*/
"ValidPeriodCfg":{
/*required, effective period parameters of the group*/
## "enable": ,
/*required, boolean, whether to enable the effective period: "true"-yes, "false"-no. If the effective period is not
enabled, it indicates that the group is permanently valid*/
"beginTime":"",
/*required, start time of the effective period (UTC time)*/
"endTime":""
/*required, end time of the effective period (UTC time)*/
## },
"groupName ":""
/*optional, string, group name*/
## }
## }
## 6.1.117
JSON_HostConfigCap
HostConfigCap capability message in JSON format
## {
"HostConfigCap":{
"isSptZone": ,
/*optional, boolean type, whether it supports zone management*/
"isSptNotRelateZones": ,
/*optional, boolean type, whether it supports getting unlinked zones*/
"isSptSubSys": ,
/*optional, boolean type, whether it supports partition configuration*/
"isSptPublicSubSys": ,
/*optional, boolean type, whether it supports public partition configuration*/
"isSptSubSysTime": ,
/*optional, boolean type, whether it supports partition timer configuration*/
"isSptDeviceTime": ,
/*optional, boolean type, whether it supports timer configuration of the security control panel*/
"ExDevice":{
"isSptSiren": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 283

/*optional, boolean type, whether it supports siren management*/
"isSptRepeater": ,
/*optional, boolean type, whether it supports repeater management*/
"isSptOutputModule": ,
/*optional, boolean type, whether it supports output module management*/
"isSptOutput": ,
/*optional, boolean type, whether it supports relay management*/
"isSptRemoteCtrl": ,
/*optional, boolean type, whether it supports keyfob management*/
"isSptExtensionModule": ,
/*optional, boolean type, whether it supports extension module management*/
"isSptCardReader": ,
/*optional, boolean type, whether it supports card reader configuration*/
"isSptKeypad": ,
/*optional, boolean type, whether it supports keypad configuration*/
"isSptKeypadAddList": ,
/*optional, boolean type, whether it supports getting the list of keypads that can be added*/
"isSptRemoteCfgPermissonUserType": ,
/*optional, boolean, whether it supports getting user names of users that have the permission to remotely configure
devices*/
"isSptPircam": ,
/*optional, boolean, whether it supports configuring pircam (detector equipped with camera) parameters*/
"isSptMuteVoicePlanCFG": ,
/*optional, boolean, whether it supports configuring muting schedule*/
"isSptCallWaitTimeCfg": ,
/*optional, boolean, whether it supports configuring calling waiting time*/
"isSptVoicePromptCfg": ,
/*optional, boolean, whether it supports configuring audio prompt parameters*/
"isSptSurroundEnvironmentCfg":
/*optional, boolean, whether it supports configuring device environment parameters*/
## },
"MsgSend":{
"isSptDirect": ,
/*optional, boolean type, whether it supports configuring alarm center notification for arming mode*/
"isSptARC": ,
/*optional, boolean type, whether it supports configuring alarm center notification for listening mode*/
"isSptCloud": ,
/*optional, boolean type, whether it supports configuring Hik-Connect notification*/
"isSptPhone": ,
/*optional, boolean type, whether it supports configuring phone call and message notification*/
"isSptPhoneAnvanced": ,
/*optional, boolean type, whether it supports advanced configuration of phone notification and SMS notification*/
"isSptMail": ,
/*optional, boolean type, whether it supports configuring E-mail notification*/
"isSptPSTNCfg":
/*optional, boolean type, whether it supports configuration of uploading events or alarms by phone call via PSTN
(Public Switched Telephone Network)*/
## },
"isSptAlarmUser": ,
/*optional, boolean type, whether it supports user management*/
"isSptSysManage": ,
/*optional, boolean type, whether it supports system management*/
Intelligent Security API (Access Control on Person) Developer Guide
## 284

"isSptCard": ,
/*optional, boolean type, whether it supports card configuration*/
"isSptEventRecord": ,
/*optional, boolean type, whether it supports event recording configuration*/
"isSptAdvanceCfg": ,
/*optional, boolean type, whether it supports advanced configuration*/
"isSptFaultCheckCfg": ,
/*optional, boolean type, whether it supports enabling fault detection*/
"isSptNetCfg": ,
/*optional, boolean type, whether it supports network configuration*/
"isSptReportCenterCfg": ,
/*optional, boolean type, whether it supports configuring method to upload reports*/
"isSptAlarmInCfg": ,
/*optional, boolean type, whetehr the device supports configuring alarm input parameters*/
"isSptAlarmOutCfg": ,
/*optional, boolean type, whether it supports configuring alarm output parameters*/
"isSptSetAlarmHostOut": ,
/*optional, boolean type, whether it supports setting alarm output*/
"isSptControlAlarmChan": ,
/*optional, boolean type, whether it supports arming or disarming the alarm input port (zone)*/
"isSptKeypadFaultProcessCfg": ,
/*optioinal, boolean type, whether it supports configuring keypad linkage parameters of the system fault*/
"isSptRegisterMode": ,
/*optional, boolean type, whether it supports registration mode configuration*/
"isSptVideoStrategy": ,
/*optional, boolean type, whether it supports configuring video recording strategy*/
"isSptVideoLinkage": ,
/*optional, boolean type, whether it supports configuring camera linkage*/
"isSptArmSchedule": ,
/*optional, boolean type, whether it supports configuring arming and disarming schedule*/
"isSptzoneAlarmTimeFilter": ,
/*optional, boolean, whether it supports filtering duplicate zone alarms in the configured time interval*/
"isSptMobCalibration":
/*optional, boolean, whether it supports map calibration for the radar*/
## }
## }
6.1.118 JSON_LockType
JSON message about the door lock status when the device is powered off
## {
" LockType ":{
## "status":""
/*required, string, door lock status when the device is powered off: "alwaysOpen"-remain open, "alwaysClose"-remain
closed*/
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 285

6.1.119 JSON_LockTypeCap
JSON message about the configuration capability of the door lock status when the device is
powered
off
## {
"LockTypeCap":{
## "status":{
/*required, string, door lock status when the device is powered off: "alwaysOpen"-remain open, "alwaysClose"-remain
closed*/
"@opt":["alwaysOpen", "alwaysClose"]
## }
## }
## }
6.1.120 JSON_LogModeCfg
LogModeCfg message in JSON format
## {
"LogModeCfg":{
## "type":
/*optional, integer, log mode: 1-16 bytes (the host log can be stored by 25w, and the employee No. can be stored by
16 bytes), 2-12 bytes (the host log can be stored by 25w, and the employee No. can be stored by 12 bytes). This node
will be set to 1 by default*/
## }
## }
## 6.1.121
JSON_MultiCardCfg
MultiCardCfg message in JSON format
## {
"MultiCardCfg":{
## "enable": ,
/*required, boolean, whether to enable multi-factor authentication*/
"swipeIntervalTimeout": ,
/*optional, integer, timeout of swiping (authentication) interval, which is between 1 and 255, and the default value is
10, unit: second*/
"GroupCfg":[{
/*optional, multi-factor authentication parameters*/
## "id": ,
/*optional, integer, multi-factor authentication No., which is between 1 and 20*/
## "enable": ,
/*optional, boolean, whether to enable the multi-factor authentication*/
"enableOfflineVerifyMode": ,
/*optional, boolean, whether to enable verification mode when the access control device is offline (the super
password will replace opening door remotely)*/
Intelligent Security API (Access Control on Person) Developer Guide
## 286

"templateNo": ,
/*optional, integer, schedule template No. to enable the multi-factor authentication*/
"GroupCombination":[{
/*optional, parameters of the multi-factor authentication group*/
## "enable": ,
/*optional, integer, whether to enable the multi-factor authentication group*/
"memberNum": ,
/*optional, integer, number of members swiping cards*/
"sequenceNo": ,
/*optional, integer, serial No. of swiping cards of the multi-factor authentication group, which is between 1 and 8*/
"groupNo":
/*optional, integer, group No., 65534-super password, 65535-remotely open door*/
## }]
## }]
## }
## }
## 6.1.122
JSON_MultiDoorInterLockCfg
MultiDoorInterLockCfg message in JSON format
## {
"MultiDoorInterLockCfg":{
## "enable": ,
/*required, boolean, whether to enable multi-door interlocking: "true"-yes, "false"-no*/
"MultiDoorGroup":[{
/*optional, parameters of the multi-door interlocking group*/
## "id": ,
/*optional, integer, multi-door interlocking No., which is between 1 and 8*/
"doorNoList":
/*optional, array, door No. list of multi-door interlocking, which is between 1 and 8. For example, [1,3,5] indicates that
door No. 1, No. 3 and No. 5 will be interlocked*/
## }]
## }
## }
6.1.123 JSON_NFCCfg
NFCCfg message in JSON format
## {
"NFCCfg":{
## "enable":
/*required, boolean, whether to enable NFC function: "true"-yes, "false"-no*/
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 287

6.1.124 JSON_NFCCfgCap
NFCCfgCap capability message in JSON format
## {
"NFCCfgCap":{
"enable":"true, false"
/*required, whether to enable NFC function: "true"-yes, "false"-no (default)*/
## }
## }
6.1.125 JSON_OSDPModify
OSDPModify message in JSON format
## {
"OSDPModify":{
"newID":
/*required, integer, new ID of the OSDP card reader*/
## }
## }
6.1.126 JSON_OSDPStatus
OSDPStatus message in JSON format
## {
"OSDPStatus":{
## "status":""
/*required, string, online status: "online", "offline"*/
## }
## }
6.1.127 JSON_PhoneDoorRightCfg
PhoneDoorRightCfg message in JSON format
## {
"PhoneDoorRightCfg":{
"openRight": ,
/*optional, array, whether to have permission to open the door. For example, [1,3,5] indicates having permission to
open the door No. 1, No. 3, and No. 5*/
"closeRight": ,
/*optional, array, whether to have permission to close the door. For example, [1,3,5] indicates having permission to
close the door No. 1, No. 3, and No. 5*/
"alwaysOpenRight": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 288

/*optional, array, whether to have permission to remain the door unlocked. For example, [1,3,5] indicates having
permission to remain the door No. 1, No. 3, and No. 5 unlocked*/
"alwaysCloseRight": ,
/*optional, array, whether to have permission to remain the door locked. For example, [1,3,5] indicates having
permission to remain the door No. 1, No. 3, and No. 5 locked*/
"armRight": ,
/*optional, array, whether to have permission to arm the alarm input port. For example, [1,3,5] indicates having
permission to arm the alarm input port No. 1, No. 3, and No. 5*/
"disarmRight":
/*optional, array, whether to have permission to disarm the alarm input port. For example, [1,3,5] indicates having
permission to disarm the alarm input port No. 1, No. 3, and No. 5*/
## }
## }
## 6.1.128
JSON_PictureServerInformation
PictureServerInformation message in JSON format
## {

"PictureServerInformation":{
"pictureServerType":"",
/*required, string type, picture storage server type: "tomact,VRB,cloudStorage,KMS"*/
"addressingFormatType":"",
/*required, string type, format type of the picture storage server address: "ipaddress"-IP address (default),
"hostname"-host name*/
"hostName":"",
/*string type, domain name of the picture storage server, the string length is between 0 and 64. This field is valid
when addressingFormatType is "hostname"*/
"ipv4Address":"",
/*string type, IPv4 address of the picture storage server, the string length is between 0 and 64. This field is valid when
addressingFormatType is "ipaddress"*/
"ipv6Address":"",
/*string type, IPv6 address of the picture storage server, the string length is between 0 and 128. This field is valid
when addressingFormatType is "ipaddress"*/
"portNo": ,
/*required, integer type, port No. of the picture storage server, which is between 1024 and 65535*/
"underlyingProtocol":"",
/*optional, string, bottom-level protocol of the picture storage server: "HTTP", "HTTPS". This field is valid when
pictureServerType contains "cloudStorage". If this field does not exist, the default bottom-level protocol is HTTP*/
"cloudStorage":{
/*parameters of the clould storage server, which is valid when pictureServerType is "cloudStorage"*/
"cloudManageHttpPort": ,
/*required, integer type, HTTP port No. for central management of the cloud storage server, which is between 1024
and 65535*/
"cloudTransDataPort": ,
/*required, integer type, data transmission port No. of the cloud storage server, which is between 1024 and 65535.
This field is not supported by access control devices*/
"cloudCmdPort": ,
/*required, integer type, signaling port No. of the cloud storage server, which is between 1024 and 65535*/
"cloudHeartBeatPort": ,
/*required, integer type, heartbeat port No. of the cloud storage server, which is between 1024 and 65535. This field
Intelligent Security API (Access Control on Person) Developer Guide
## 289

is not supported by access control devices*/
"cloudStorageHttpPort": ,
/*required, integer type, HTTP port No. of the cloud storage server, which is between 1024 and 65535. This field is not
supported by access control devices*/
"cloudUsername":"",
/*required, string type, user name of the cloud storage server, the string length is between 0 and 32. This field is not
supported by access control devices*/
"cloudPassword":"",
/*required, string type, password of the cloud storage server, the string length is between 0 and 32. This field is not
supported by access control devices*/
"cloudPoolId": ,
/*required, integer type, cloud storage pool ID, which is between 1 and 4294967295. If this field is not configured by
the upper-level, this field will be set to 1 by default*/
"cloudPoolIdEx":"",
/*optional, string type, cloud storage pool ID, this node is valid when cloud storage pool ID of type string (cloud
storage protocol in version 3.0) is supported*/
"clouldProtocolVersion":"",
/*required, string type, protocol version of the cloud storage server, the string length is between 0 and 32*/
"clouldAccessKey":"",
/*string type, cloud storage server access_key, the string length is between 0 and 64. This field is valid when
clouldProtocolVersion is "V2.0"*/
"clouldSecretKey":""
/*string type, cloud storage server secret_key, the string length is between 0 and 64. This field is valid when
clouldProtocolVersion is "V2.0"*/
## }
## }
## }
6.1.129 JSON_PrinterCfg
PrinterCfg message in JSON format
## {
"PrinterCfg": {
/*required, boolean, whether to enable the printer*/
## "enable": ,
"printFormat": {
"vistorPic": {
/*optional, visitor picture*/
## "enable": ,
/*required, boolean, whether to print visitor picture*/
"lineNo":
/*required, integer, line No.*/
## },
"vistorName": {
/*optional, visitor name*/
## "enable": ,
/*required, boolean, whether to print visitor name*/
"lineNo":
/*required, integer, line No.*/
## },
Intelligent Security API (Access Control on Person) Developer Guide
## 290

"certificateNumber": {
/*optional, visitor's certificate No.*/
## "enable": ,
/*required, boolean, whether to print visitor's certificate No.*/
"lineNo":
/*required, integer, line No.*/
## },
## "address": {
/*optional, visitor's address*/
## "enable": ,
/*required, boolean, whether to print visitor's address*/
"lineNo":
/*required, integer, line No.*/
## },
## "validity": {
/*optional, expiry date*/
## "enable": ,
/*required, whether to print the expiry date*/
"lineNo":
/*required, integer, line No.*/
## },
"receptionDepartment": {
/*optional, reception department*/
## "enable": ,
/*required, boolean, whether to print the reception department*/
"lineNo":
/*required, integer, line No.*/
## },
"receptionStaff": {
/*optional, receptionist information*/
## "enable": ,
/*required, boolean, whether to print the receptionist information*/
"lineNo":
/*required, integer, line No.*/
## },
"registrationTime": {
/*optional, registered time*/
## "enable": ,
/*optional, whether to print the registered time*/
"lineNo":
/*required, integer, line No.*/
## },
## }
## }
## }
6.1.130 JSON_RemoteControlBuzzer
RemoteControlBuzzer message in JSON format
Intelligent Security API (Access Control on Person) Developer Guide
## 291

## {
"RemoteControlBuzzer":{
## "cmd":""
/*required, string, command: "start"-start buzzing, "stop"-stop buzzing*/
## }
6.1.131 JSON_RemoteControlPWCfg
RemoteControlPWCfg message in JSON format
## {
"RemoteControlPWCfg":{
## "password":""
/*optional, string type, password for remote door control*/
## }
## }
6.1.132 JSON_RemoteControlPWCheck
RemoteControlPWCheck message in JSON format
## {
"RemoteControlPWCheck":{
## "password":""
/*optional, string type, password for remote door control (or EZVIZ verification code)*/
## }
## }
6.1.133 JSON_ResponseStatus
ResponseStatus message in JSON format.
## {
"requestURL":"",
/*optional, string type, request URL*/
"statusCode": ,
/*required, integer type, status code*/
"statusString":"",
/*required, string type, status
description*/
"subStatusCode":"",
/*required, string type, sub status code*/
"errorCode": ,
/*optional, integer type, error code, which corresponds to subStatusCode, this field is required when statusCode is
not 1*/
"errorMsg":"",
Intelligent Security API (Access Control on Person) Developer Guide
## 292

/*optional, string type, error details, this field is required when statusCode is not 1*/
## }
## Note
See Error Codes in ResponseStatus for details about the status codes, sub status codes, error
codes, and error descriptions.
6.1.134 JSON_RFCardCfg
RFCardCfg message in JSON format
## {
"RFCardCfg":[{
"cardType":"",
/*required, string, card type: "EMCard"-EM card, "M1Card"-M1 card, "CPUCard"-CPU card, "IDCard"-ID card*/
## "enabled":
/*required, boolean, whether to enable RF card recognition: "true"-yes, "false"-no*/
## }]
## }
6.1.135 JSON_RFCardCfgCap
RFCardCfgCap capability message in JSON format
## {
"RFCardCfgCap":{
"cardType":{
/*required, string, card type: "EMCard"-EM card, "M1Card"-M1 card, "CPUCard"-CPU card, "IDCard"-ID card*/
"@opt":["EMCard","M1Card","CPUCard","IDCard"]
## },
## "enabled":{
/*required, boolean, whether to enable RF card recognition: "true"-yes, "false"-no*/
## "@opt":[true,false]
## }
## }
## }
6.1.136 JSON_SearchFaceRecordCond
Message about
conditions of searching for face records, and it is in JSON format.
## {
"searchResultPosition": "",
/*required, initial position of search result list, integer32 type. When there are multiple records, and cannot get all
records in one time searching, you can search the records followed specified position for next search. For video
intercom devices, this field can only be set to 0 as the picture will be returned along with the message*/
Intelligent Security API (Access Control on Person) Developer Guide
## 293

"maxResults": "",
/*required, int32 type, maximum number of records for single searching. If maxResults exceeds the range defined by
the device capability, the device will return the maximum number of records according to the device capability and
will not return error. For video intercom devices, this field can only be set to 1 as the picture will be returned along
with the message*/
"faceLibType": "",
/*required, face picture library type: "blackFD"-list library, "staticFD"-static library, string type, the maximum size is 32
bytes*/
## "FDID": "",
/*required, face picture library ID, string type, the maximum size is 63*/
## "FPID": "",
/*optional, string type, face record ID, it can be generated by device or inputted. If it is inputted, it should be the
unique ID with the combination of letters and digits, and the maximum length is 63 bytes; if it is generated by the
device automatically, it is the same as the employee No. (person ID)*/
"startTime": "",
/*optional, start time, ISO8601 time format, string type, the maximum size is 32 bytes*/
"endTime": "",
/*optional, end time, ISO8601 time format, string type, the maximum size is 32 bytes*/
## "name": "",
/*optional, name, string type, the maximum size is 96 bytes*/
## "gender": "",
/*optional, gender: male, female, unknown, string type, the maximum size is 10*/
## "city": "",
/*optional, city code of birth for the person in the face picture, string type, the maximum size is 32 bytes*/
"certificateType": "",
/*optional, string type, the maximum size is 10 bytes, certificate type: "officerID"-officer ID, "ID"-identify card,
passport, other*/
"certificateNumber": ""
/*optional, certificate No., string, the maximum size is 32 bytes*/
"isInLibrary": "yes",
/*optional, string type, whether the picture is in library (whether modeling is successful): unknown, no, yes*/
"isDisplayCaptureNum": true,
/*optional, boolean type, whether to display number of captured pictures, true: display, false: hide, by default it is
false*/
"rowKey ":"",
/*optional, string type, face picture library main key. Search by rowKey can be more efficient, the maximum size is 64
bytes*/
## "transfer":true
/*optional, boolean type, whether to enable transfer*/
## }
6.1.137 JSON_SearchFaceRecordResult
Message about result of searching for face record.
## {
"requestURL": "",
"statusCode": "",
"statusString": "",
"subStatusCode": "",
"errorCode": "",
Intelligent Security API (Access Control on Person) Developer Guide
## 294

"errorMsg": "",
/*see the description of this node and above nodes in the message of JSON_ResponseStatus*/
"responseStatusStrg": "",
/*optional, searching status: "OK"-searching ended, "NO MATCHES"-no data found, "MORE"-searching, string type,
the max. size is 32 bytes. It is valid only when errorCode is 1 and errorMsgis ok*/
"searchResultPosition": "",
/*optional, initial position of search result list, integer32 type. It is valid only when errorCode is 1 and errorMsgis ok*/
"numOfMatches": "",
/*optional, returned number of results for current search, integer32. It is valid only when errorCode is 1 and
errorMsgis ok*/
"totalMatches": "",
/*optional, total number of matched results, integer32. It is valid only when errorCode is 1 and errorMsgis ok*/
"MatchList":[
/*optional, searched matched data information, array. It is valid only when errorCode is 1 and errorMsgis ok*/
## {
## "FPID":"",
/*optional, string type, face record ID (it is the same as the employee No. (person ID)), the maximum length is 63
bytes*/
"faceURL":"",
/*optional, face picture URL, string type, the maximum size is 128 bytes*/
## "name":"",
/*required, name of person in the face picture, string type, the maximum size is 96 bytes*/
## "gender": "",
/*optional, gender of person in the face picture: male, female, unknown, string type, the maximum size is 32 bytes*/
"bornTime": "",
/*required, birthday of person in the face picture, ISO8601 time format, string type, the maximum size is 20 bytes*/
## "city": "",
/*optional, city code of birth for the person in the face picture, string type, the maximum size is 32 bytes*/
"certificateType": "",
/*optional, string type, the max. size is 10 bytes, certificate type: "officerID"-officer ID, "ID"-identify card, passport,
other*/
"certificateNumber": "",
/*optional, certificate No., string, the max. size is 32 bytes*/
"caseInfo": "",
/*optional, case information, string type, the max. size is 192 bytes, it is valid when faceLibType is blackFD.*/
## "tag": "",
/*optional, custom tag, up to 4 tags, which are separated by commas, string type, the max. size is 195 bytes, it is valid
when faceLibType is blackFD.*/
## "address": "",
/*optional, person address, string type, the max. size is 192 bytes, it is valid when faceLibType is staticFD.*/
"customInfo": "",
/*optional, custom information, string type, the max. size is 192 bytes, it is valid when faceLibType is staticFD.*/
"modelData":""
/*optional, string type, target model data, non-modeled binary data needs to be encrypted by base64 during
transmission*/
"isInLibrary": "yes",
/*optional, string type, whether the picture is in library (whether modeling is successful): unknown, no, yes*/
"captureNum": 12,
/*optional, int, number of captured pictures*/
"rowKey": ""
/*optional, string type, face picture library main key. Search by rowKey can be more efficient, the maximum size is 64
bytes*/
Intelligent Security API (Access Control on Person) Developer Guide
## 295

## }
## ]
## }
## See Also
JSON_ResponseStatus
6.1.138 JSON_SetAlarmHostOut
SetAlarmHostOut message in JSON format
## {
"SetAlarmHostOut":{
"alarmOutPort": ,
/*required, integer, alarm output port index, which starts from 0, 65535-all alarm output ports*/
"alarmOutStatus":""
/*required, string, alarm output status: "stop"-stop output, "start"-start output*/
## }
## }
6.1.139 JSON_SetFaceRecord
Message about the setting information of face record, and it is in JSON format.
## {
"faceURL":"",
/*optional, string type, picture storage URL inputted when uploading the face picture by URL, the maximum length is
256 bytes*/
"faceLibType":"",
/*required, string type, face picture library type: "blackFD"-list library, "staticFD"-static library, the maximum length is
32 bytes*/
## "FDID":"",
/*required, string type, face picture library ID, the maximum length is 63 bytes*/
## "FPID":"",
/*optional, string type, face record ID, it can be generated by the device or inputted. If it is inputted, it should be the
unique ID with the combination of letters and digits, and the maximum length is 63 bytes; if it is generated by the
device automatically, it is the same as the employee No. (person ID)*/
"deleteFP": ,
/*optional, boolean type, whether to delete the face record: "true"-yes. This node is required when the face record
needs to be deleted; for adding or editing the face record, this node should be set to NULL*/
## "name":"",
/*required, string type, name of the person in the face picture, the maximum length is 96 bytes*/
## "gender":"",
/*optional, string type, gender of the person in the face picture: "male", "female", "unknown", the maximum length is
32 bytes*/
"bornTime":"",
/*required, string type, date of birth of the person in the face picture in ISO8601 time format, the maximum length is
20 bytes*/
## "city":"",
Intelligent Security API (Access Control on Person) Developer Guide
## 296

/*optional, string type, code of the city of birth for the person in the face picture, the maximum length is 32 bytes*/
"certificateType ":"",
/*optional, string type, ID type: "officerID"-officer ID, "ID"-ID card. The maximum length is 10 bytes*/
"certificateNumber":"",
/*optional, string type, ID No., the maximum length is 32 bytes*/
"caseInfo":"",
/*optional, string type, case information, the maximum length is 192 bytes, it is valid when faceLibType is "blackFD"*/
## "tag":"",
/*optional, string type, custom tag, up to 4 tags can be added and they should be separated by commas, the
maximum length of each tag is 48 bytes, and the maximum length of this node is 195 bytes. It is valid when
faceLibType is "blackFD"*/
## "address":"",
/*optional, string type, person address, the maximum length is 192 bytes, it is valid when faceLibType is "staticFD"*/
"customInfo":"",
/*optional, string type, custom information, the maximum length is 192 bytes, it is valid when faceLibType is
"staticFD"*/
"modelData":""
/*optional, string type, target model data, non-modeled binary data needs to be encrypted by base64 during
transmission*/
## }
6.1.140 JSON_SingleFPLibInfo
Message about the information of a face picture library, and it is in JSON format.
## {
"requestURL": "",
"statusCode": "",
"statusString": "",
"subStatusCode": "",
"errorCode": "",
"errorMsg": "",
/*see the description of this node and above nodes in the message of JSON_ResponseStatus*/
"faceLibType": "",
/*optional, face picture library type: "blackFD"-list library, "staticFD"-static library, string type, the max. string length is
32 bytes*/
## "name": "",
/*optional, face picture library name, string type, the max. string length is 48 bytes*/
"customInfo": ""
/*optional, custom information, string type, the max. string length is 192 bytes*/
## }
## See Also
JSON_ResponseStatus
## 6.1.141
JSON_SmsRelativeParam
SmsRelativeParam message in JSON format
Intelligent Security API (Access Control on Person) Developer Guide
## 297

## {
"SmsRelativeParam":{
"WhiteList":[{
/*required, mobile phone number whitelist*/
## "id": ,
/*required, integer, No. of mobile phone number whitelist*/
"phoneNo":"",
/*required, string, mobile phone number*/
"doorControl": ,
/*optional, boolean, whether to support door operation control: "true"-yes, "false"-no*/
"acsPassword":""
/*optional, string, command to open the door*/
## }]
## }
## }
6.1.142 JSON_TTSText
JSON message about the text parameters of the audio prompt for the authentication results
## {
"TTSText":{
## "enable": ,
/*required, boolean, whether to enable: true-enable, false-disable*/
## "prefix":"",
/*optional, string, whether to play the audio with "user name" or "honorific and last name of the user" as the prefix:
"name"-play the audio with "user name" (e.g., "Jack Smith" will be played), "lastname"-play the audio with "honorific
and last name of the user" (e.g., "Mr. Smith" will be played), "none" (default)*/
"Success":[{
"TimeSegment":{
/*optional, time period*/
"beginTime":"",
/*required, string, start time, which is between 00:00:00 and 23:59:59*/
"endTime":""
/*required, string, end time, which is between 00:00:00 and 23:59:59*/
## },
## "language":"",
/*optional, string, language: "SimChinese,TraChinese,English"*/
## "text":""
/*required, string, text of the audio prompt*/
## }],
"Failure":[{
"TimeSegment":{
/*optional, time period*/
"beginTime":"",
/*required, string, start time, which is between 00:00:00 and 23:59:59*/
"endTime":""
/*required, string, end time, which is between 00:00:00 and 23:59:59*/
## },
## "language":"",
Intelligent Security API (Access Control on Person) Developer Guide
## 298

/*optional, string, language: "SimChinese,TraChinese,English"*/
## "text":""
/*required, string, text of the audio prompt*/
## }]
## }
## }
6.1.143 JSON_UserInfo
UserInfo message in JSON format
## {
"UserInfo":{
"employeeNo":"",
/*required, string, employee No. (person ID)*/
"deleteUser": ,
/*optional, boolean, whether to delete the person: "true"-yes. This node is required only when the person needs to
be deleted; for adding or editing person information, this node can be set to NULL*/
## "name":"",
/*optional, string, person name*/
"userType":"",
/*required, string, person type: "normal"-normal person (household), "visitor", "blackList"-person in blacklist*/
"closeDelayEnabled": ,
/*optional, boolean, whether to enable door close delay: "true"-yes, "false"-no*/
"Valid":{
/*required, parameters of the effective period, the effective period can be a period of time between 1970-01-01
00:00:00 and 2037-12-31 23:59:59*/
## "enable": ,
/*required, boolean, whether to enable the effective period: "false"-disable, "true"-enable. If this node is set to
"false", the effective period is permanent*/
"beginTime":"",
/*required, start time of the effective period (if timeType does not exist or is "local", the beginTime is the device local
time, e.g., 2017-08-01T17:30:08; if timeType is "UTC", the beginTime is UTC time, e.g., 2017-08-01T17:30:08+08:00)*/
"endTime":"",
/*required, end time of the effective period (if timeType does not exist or is "local", the endTime is the device local
time, e.g., 2017-08-01T17:30:08; if timeType is "UTC", the endTime is UTC time, e.g., 2017-08-01T17:30:08+08:00)*/
"timeType":""
/*optional, string, time type: "local"- device local time, "UTC"- UTC time*/
## },
"belongGroup":"",
/*optional, string, group*/
## "password":"",
/*optional, string, password*/
"doorRight":"",
/*optional, string, No. of the door or lock that has access permission, e.g., "1,3" indicates having permission to access
door (lock) No. 1 and No. 3*/
"RightPlan":[{
/*optional, door permission schedule (lock permission schedule)*/
"doorNo": ,
/*optional, integer, door No. (lock ID)*/
"planTemplateNo":""
Intelligent Security API (Access Control on Person) Developer Guide
## 299

/*optional, string, schedule template No.*/
## }],
"maxOpenDoorTime": ,
/*optional, integer, maximum authentication attempts, 0-unlimited*/
"openDoorTime": ,
/*optional, integer, read-only, authenticated attempts*/
"roomNumber": ,
/*optional, integer, room No.*/
"floorNumber": ,
/*optional, integer, floor No.*/
"doubleLockRight": ,
/*optional, boolean, whether to have the permission to open the double-locked door: "true"-yes, "false"-no*/
"localUIRight": ,
/*optional, boolean, whether to have the permission to access the device local UI: "true"-yes, "false"-no*/
"userVerifyMode":"",
/*optional, string, person authentication mode: "cardAndPw"-card+password, "card"-card, "cardOrPw"-card or
password, "fp"-fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint
+card, "fpAndCardAndPw"-fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or
password, "faceAndFp"-face+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face"-face,
"employeeNoAndPw"-employee No.+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee
No.+fingerprint, "employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face
+fingerprint+card, "faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face,
"faceOrfaceAndCard"-face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password,
"cardOrFace"-card or face, "cardOrFaceOrFp"-card or face or fingerprint, "cardOrFpOrPw"-card or fingerprint or
password. The priority of the person authentication mode is higher than that of the card reader authentication
mode*/
"checkUser": ,
/*optional, boolean, whether to verify the duplicated person information: "false"-no, "true"-yes. If checkUser is not
configured, the device will verify the duplicated person information by default. When there is no person information,
you can set checkUser to "false" to speed up data applying; otherwise, it is not recommended to configure this node*/
"addUser": ,
/*optional, boolean type, whether to add the person if the person information being edited does not exist: "false"-no
(if the device has checked that the person information being edited does not exist, the failure response message will
be returned along with the error code), "true"-yes (if the device has checked that the person information being edited
does not exist, the success response message will be returned, and the person will be added). If this node is not
configured, the person will not be added by default*/
"callNumbers": ["","",""],
/*optional, string type, room No. list to be called, by default, its format is X-X-X-X (e.g., 1-1-1-401), which is extended
from roomNumber; for standard SIP, it can be the SIP number*/
"floorNumbers": [ , ],
/*optional, integer type, floor No. list, which is extended from floorNumber*/
"numOfFace": ,
/*optional, read-only, number of linked face pictures. If this field is not returned, it indicates that this function is not
supported*/
"numOfFP": ,
/*optional, read-only, number of linked fingerprints. If this field is not returned, it indicates that this function is not
supported*/
"numOfCard": ,
/*optional, read-only, number of linked cards. If this field is not returned, it indicates that this function is not
supported*/
## "gender":"",
/*optional, string, gender of the person in the face picture: "male", "female", "unknown"*/
Intelligent Security API (Access Control on Person) Developer Guide
## 300

"PersonInfoExtends":[{
/*optional, person extension information*/
## "name":"",
/*optional, string, name of the person extension information*/
## "value":""
/*optional, string, content of the person extension information*/
## }]
## }
## }
6.1.144 JSON_UserInfoCount
UserInfoCount message in JSON format
## {
"UserInfoCount":{
"userNumber":
/*required, integer, number of persons*/
## }
## }
6.1.145 JSON_UserInfoDelCond
UserInfoDelCond message in JSON format
## {
"UserInfoDelCond":{
"EmployeeNoList":[{
/*optional, person ID list (if this node does not exist or is set to NULL, it indicates deleting all person information)*/
"employeeNo":""
/*optional, string, employee No. (person ID)*/
## }]
## }
## }
6.1.146 JSON_UserInfoDetail
UserInfoDetail message in JSON format
## {
"UserInfoDetail":{
## "mode":"",
/*required, string type, deleting mode: "all"-delete all, "byEmployeeNo"-delete by employee No. (person ID)*/
"EmployeeNoList":[{
/*optional, person ID list, if this node does not exist or is null, it indicates deleting all person information (including
linked cards and fingerprints) and permissions*/
"employeeNo":""
Intelligent Security API (Access Control on Person) Developer Guide
## 301

/*optional, string type, employee No. (person ID), it is valid when mode is "byEmployeeNo"*/
## }]
## }
## }
6.1.147 JSON_UserInfoDetailDeleteProcess
UserInfoDetailDeleteProcess message in JSON format
## {
"UserInfoDetailDeleteProcess":{
## "status":""
/*required, string type, status: "processing", "success", "failed"*/
## }
## }
6.1.148 JSON_UserInfoSearch
UserInfoSearch message in JSON format
## {
"UserInfoSearch":{
"searchID":"",
/*required, string type, search ID, which is used to confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
"responseStatusStrg":"",
/*required, string, search status: "OK"-searching completed, "NO MATCH"-no matched results, "MORE"-searching for
more results*/
"numOfMatches": ,
/*required, integer32, number of returned results this time*/
"totalMatches": ,
/*required, integer32, total number of matched results*/
"UserInfo":[{
/*optional, person information*/
"employeeNo":"",
/*required, string, employee No. (person ID)*/
## "name":"",
/*optional, string, person name*/
"userType":"",
/*required, string, person type: "normal"-normal person (household), "visitor", "blackList"-person in blacklist*/
"closeDelayEnabled": ,
/*optional, boolean, whether to enable door close delay: "true"-yes, "false"-no*/
"Valid":{
/*required, parameters of the effective period*/
## "enable":"",
/*required, boolean, whether to enable the effective period: "false"-disable, "true"-enable. If this node is set to
"false", the effective period is permanent*/
"beginTime":"",
Intelligent Security API (Access Control on Person) Developer Guide
## 302

/*required, start time of the effective period (if timeType does not exist or is "local", the beginTime is the device local
time, e.g., 2017-08-01T17:30:08; if timeType is "UTC", the beginTime is UTC time, e.g., 2017-08-01T17:30:08+08:00)*/
"endTime":"",
/*required, end time of the effective period (if timeType does not exist or is "local", the endTime is the device local
time, e.g., 2017-08-01T17:30:08; if timeType is "UTC", the endTime is UTC time, e.g., 2017-08-01T17:30:08+08:00)*/
"timeType":""
/*optional, string, time type: "local"- device local time, "UTC"- UTC time*/
## },
"belongGroup":"",
/*optional, string, group*/
## "password":"",
/*optional, string, password*/
"doorRight":"",
/*optional, string, No. of door or lock that has access permission, e.g., "1,3" indicates having permission to access
door (lock) No. 1 and No. 3*/
"RightPlan":[{
/*optional, access permission schedule of the door or lock*/
"doorNo": ,
/*optional, integer, door No. (lock ID)*/
"planTemplateNo":""
/*optional, string, schedule template No.*/
## }],
"maxOpenDoorTime": ,
/*optional, integer, the maximum authentication attempts, 0-unlimited*/
"openDoorTime": ,
/*optional, integer, read-only, authenticated attempts*/
"roomNumber": ,
/*optional, integer, room No.*/
"floorNumber": ,
/*optional, integer, floor No.*/
"doubleLockRight": ,
/*optional, boolean, whether to have the permission to open the double-locked door: "true"-yes, "false"-no*/
"localUIRight": ,
/*optional, boolean, whether to have the permission to access the device local UI: "true"-yes, "false"-no*/
"userVerifyMode":"",
/*optional, string, person authentication mode: "cardAndPw"-card+password, "card"-card, "cardOrPw"-card or
password, "fp"-fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint
+card, "fpAndCardAndPw"-fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or
password, "faceAndFp"-face+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face"-face,
"employeeNoAndPw"-employee No.+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee
No.+fingerprint, "employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face
+fingerprint+card, "faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face,
"faceOrfaceAndCard"-face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password,
"cardOrFace"-card or face, "cardOrFaceOrFp"-card or face or fingerprint, "cardOrFpOrPw"-card or fingerprint or
password. The priority of the person authentication mode is higher than that of the card reader authentication
mode*/
## "gender":"",
/*optional, string, gender of the person in the face picture: "male", "female", "unknown"*/
"PersonInfoExtends":[{
/*optional, person extension information*/
## "name":"",
/*optional, string, name of the person extension information*/
Intelligent Security API (Access Control on Person) Developer Guide
## 303

## "value":""
/*optional, string, content of the person extension information*/
## }]
## }]
## }
## }
6.1.149 JSON_UserInfoSearchCond
UserInfoSearchCond message in JSON format
## {
"UserInfoSearchCond":{
"searchID":"",
/*required, string type, search ID, which is used to confirm the upper-level platform or system. If the platform or the
system is the same one during two searching, the search history will be saved in the memory to speed up next
searching*/
"searchResultPosition": ,
/*required, integer32 type, the start position of the search result in the result list. When there are multiple records
and you cannot get all search results at a
time, you can search for the records after the specified position next time*/
"maxResults": ,
/*required, integer32 type, maximum number of search results. If maxResults exceeds the range returned by the
device capability, the device will return the maximum number of search results according to the device capability and
will not return error message*/
"EmployeeNoList":[{
/*optional, person ID list (if this node does not exist or is set to NULL, it indicates searching for all person
information)*/
"employeeNo":""
/*optional, string type, employee No. (person ID)*/
## }]
## }
## }
6.1.150 JSON_UserRightHolidayGroupCfg
UserRightHolidayGroupCfg message in JSON format
## {
"UserRightHolidayGroupCfg": {
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"groupName": "",
/*required, string, holiday group name*/
"holidayPlanNo": ""
/*required, string, holiday group schedule No.*/
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 304

6.1.151 JSON_UserRightHolidayPlanCfg
UserRightHolidayPlanCfg message in JSON format
## {
"UserRightHolidayPlanCfg": {
## "enable": ,
/*required, boolean，whether to enable: "true"-enable, "false"-disable*/
"beginDate": "",
/*start date of the holiday (device local time)*/
"endDate": "",
/*end date of the holiday (device local time)*/
"HolidayPlanCfg" : [{
/*holiday schedule parameters*/
## "id": ,
/*required, integer, time period No., which is between 1 and 8*/
## "enable": ,
/*required, boolean，whether to enable: "true"-enable, "false"-disable*/
"TimeSegment": {
"beginTime": "",
/*required, start
time of the time period (device local time)*/
"endTime": ""
/*required, end time of the time period (device local time)*/
## }
## }]
## }
## }
6.1.152 JSON_UserRightPlanTemplate
UserRightPlanTemplate message in JSON format
## {
"UserRightPlanTemplate": {
## "enable": ,
/*required, boolean，whether to enable: "true"-enable, "false"-disable*/
"templateName": "",
/*required, string, template name*/
"weekPlanNo": ,
/*required, integer, week schedule No.*/
"holidayGroupNo": ""
/*required, string, holiday group No.*/
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 305

6.1.153 JSON_UserRightWeekPlanCfg
UserRightWeekPlanCfg message in JSON format
## {
"UserRightWeekPlanCfg":{
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"WeekPlanCfg":[{
/*required, week schedule parameters*/
## "week":"",
/*required, string, day of the week: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"*/
## "id": ,
/*required, integer, time period No., which is between 1 and 8*/
## "enable": ,
/*required, boolean，whether to enable: "true"-enable, "false"-disable*/
"TimeSegment":{
"beginTime":"",
/*required, start time of the time period (device local time)*/
"endTime":""
/*required, end
time of the time period (device local time)*/
## }
## }]
## }
## }
6.1.154 JSON_VerifyHolidayGroupCfg
VerifyHolidayGroupCfg message in JSON format
## {
"VerifyHolidayGroupCfg": {
## "enable": ,
/*required, boolean，whether to enable: "true"-enable, "false"-disable*/
"groupName": "",
/*required, string, holiday group name*/
"holidayPlanNo": ""
/*required, string, holiday group schedule No.*/
## }
## }
6.1.155 JSON_VerifyHolidayPlanCfg
VerifyHolidayPlanCfg message in JSON format
## {
"VerifyHolidayPlanCfg": {
## "enable": ,
Intelligent Security API (Access Control on Person) Developer Guide
## 306

/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"beginDate": "",
/*required, start date of the holiday (device local time)*/
"endDate": "",
/*required, end date of the holiday (device local time)*/
"HolidayPlanCfg": [{
/*required, holiday schedule parameters*/
## "id": ,
/*required, integer, time period No., which is between 1 and 8*/
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"verifyMode": "",
/*required, string, authentication mode: "cardAndPw"-card+password, "card", "cardOrPw"-card or password, "fp"-
fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint+card,
"fpAndCardAndPw"-fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or password,
"faceAndFp"-face+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face", "employeeNoAndPw"-
employee No.+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee No.+fingerprint,
"employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face+fingerprint+card,
"faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face, "faceOrfaceAndCard"-
face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password, "cardOrFace"-card or
face, "cardOrFaceOrFp"-card or face or fingerprint, "cardOrFpOrPw"-card or fingerprint or password, "sleep",
## "invalid"*/
"TimeSegment": {
"beginTime": "",
/*required, start time of the time period (device local time)*/
"endTime": "",
/*required, end time of the time period (device local time)*/
## }
## }]
## }
## }
6.1.156 JSON_VerifyPlanTemplate
VerifyPlanTemplate message in JSON format
## {
"VerifyPlanTemplate": {
## "enable": ,
/*required, boolean，whether to enable: "true"-enable, "false"-disable*/
"templateName": "",
/*required, string, template name*/
"weekPlanNo": ,
/*required, integer, week schedule No.*/
"holidayGroupNo": ""
/*required, string, holiday group No.*/
## }
## }
Intelligent Security API (Access Control on Person) Developer Guide
## 307

6.1.157 JSON_VerifyWeekPlanCfg
VerifyWeekPlanCfg message in JSON format
## {
"VerifyWeekPlanCfg":{
## "enable": ,
/*required, boolean, whether to enable: "true"-enable, "false"-disable*/
"WeekPlanCfg":[{
/*required, week schedule parameters*/
## "week":"",
/*required, string, days of the week: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
"Sunday"*/
## "id": ,
/*required, integer, time period No., which is between 1 and 8*/
## "enable": ,
/*required, boolean，whether to enable: "true"-enable, "false"-disable*/
"verifyMode":"",
/*required, string, authentication mode: "cardAndPw"-card+password, "card"-card, "cardOrPw"-card or password,
"fp"-fingerprint, "fpAndPw"-fingerprint+password, "fpOrCard"-fingerprint or card, "fpAndCard"-fingerprint+card,
"fpAndCardAndPw"-fingerprint+card+password, "faceOrFpOrCardOrPw"-face or fingerprint or card or password,
"faceAndFp"-face+fingerprint, "faceAndPw"-face+password, "faceAndCard"-face+card, "face"-face,
"employeeNoAndPw"-employee No.+password, "fpOrPw"-fingerprint or password, "employeeNoAndFp"-employee
No.+fingerprint, "employeeNoAndFpAndPw"-employee No.+fingerprint+password, "faceAndFpAndCard"-face
+fingerprint+card, "faceAndPwAndFp"-face+password+fingerprint, "employeeNoAndFace"-employee No.+face,
"faceOrfaceAndCard"-face or face+card, "fpOrface"-fingerprint or face, "cardOrfaceOrPw"-card or face or password,
"cardOrFace"-card or face, "cardOrFaceOrFp"-card or face or fingerprint, "cardOrFpOrPw"-card or fingerprint or
password, "sleep", "invalid"*/
"TimeSegment":{
"beginTime":"",
/*required, start time of the time period (device local time)*/
"endTime":""
/*required, end time of the time period (device local time)*/
## }
## }]
## }
## }
6.2 XML Messages
6.2.1 XML_CaptureFaceData
CaptureFaceData message in XML format
<CaptureFaceData version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<faceDataUrl>
<!--dep, xs: string, face data URL, if this node does not exist, it indicates that there is no face data-->
</faceDataUrl>
Intelligent Security API (Access Control on Person) Developer Guide
## 308

<captureProgress>
<!--req, xs: integer, collection progress, which is between 0 and 100, 0-no face data collected, 100-collected, the
face data URL can be parsed only when the progress is 100-->
</captureProgress>
<isCurRequestOver>
<!--opt, xs:boolean, whether the current collection request is completed: "true"-yes, "false"-no-->
</isCurRequestOver>
<infraredFaceDataUrl>
<!--dep, xs:string, infrared face data URL, if this node does not exist, it indicates that there is no infrared face data-->
</infraredFaceDataUrl>
</CaptureFaceData>
6.2.2 XML_CaptureFaceDataCond
CaptureFaceDataCond message in XML format
<CaptureFaceDataCond version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<captureInfrared>
<!--opt, xs:boolean, whether to collect infrared face pictures simultaneously: "true"-yes, "false"-no-->
<captureInfrared>
<dataType><!--opt, xs:string, data type of collected face pictures: "url" (default), "binary"--><dataType>
</CaptureFaceDataCond>
6.2.3 XML_CaptureFingerPrint
CaptureFingerPrint message in XML format
<CaptureFingerPrint version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<fingerData><!--dep, xs:string, fingerprint data, which is between 1 and 768, and it should be encoded by Base64--></
fingerData>
<fingerNo><!--req, xs:integer, finger No., which is between 1 and 10--></fingerNo>
<fingerPrintQuality><!--req, xs:integer, fingerprint quality, which is between 1 and 100--></fingerPrintQuality>
</CaptureFingerPrint>
6.2.4 XML_CaptureFingerPrintCond
CaptureFingerPrintCond message in XML format
<CaptureFingerPrintCond version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<fingerNo><!--req, xs: integer, finger No., which is between 1 and 10--></fingerNo>
</CaptureFingerPrintCond>
6.2.5 XML_Cap_AccessControl
AccessControl capability message in XML format
Intelligent Security API (Access Control on Person) Developer Guide
## 309

<AccessControl version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<isSupportWiegandCfg>
<!--opt, xs:boolean, whether it supports Wiegand configuration-->
</isSupportWiegandCfg>
<isSupportModuleStatus>
<!--opt, xs:boolean, whether it supports getting the status of secure door control unit-->
</isSupportModuleStatus>
<isSupportSNAPConfig>
<!--opt, xs:boolean, whether it supports getting capture linkage parameters-->
</isSupportSNAPConfig>
<LocalController><!--opt-->
<isSupportLocalControllerManage>
<!--opt, xs:boolean, whether it supports distributed access controller management-->
</isSupportLocalControllerManage>
<isSupportLocalControllerControl>
<!--opt, xs:boolean, whether it supports distributed access controller control-->
</isSupportLocalControllerControl>
</LocalController>
<isSupportUSBManage>
<!--opt, xs:boolean, whether it supports USB management of access control device-->
</isSupportUSBManage>
<isSupportIdentityTerminal>
<!--opt, xs:boolean, whether it supports face recognition terminal configuration-->
</isSupportIdentityTerminal>
<isSupportDepartmentParam>
<!--opt, xs:boolean, whether it supports setting department parameters-->
</isSupportDepartmentParam>
<isSupportSchedulePlan>
<!--opt, xs:boolean, whether it supports setting shift schedule-->
</isSupportSchedulePlan>
<isSupportAttendanceRule>
<!--opt, xs:boolean, whether it supports setting time and attendance rule-->
</isSupportAttendanceRule>
<isSupportOrdinaryClass>
<!--opt, xs:boolean, whether it supports setting normal shift parameters-->
</isSupportOrdinaryClass>
<isSupportWorkingClass>
<!--opt, xs:boolean, whether it supports setting man-hour shift parameters-->
</isSupportWorkingClass>
<isSupportAttendanceHolidayGroup>
<!--opt, xs:boolean, whether it supports setting holiday group for time and attendance-->
</isSupportAttendanceHolidayGroup>
<isSupportAttendanceHolidayPlan>
<!--opt, xs:boolean, whether it supports setting holiday schedule for time and attendance-->
</isSupportAttendanceHolidayPlan>
<isSupportLadderControlRelay>
<!--opt, xs:boolean, whether it supports setting elevator controller relay-->
</isSupportLadderControlRelay>
<isSupportWiegandRuleCfg>
<!--opt, xs:boolean, whether it supports setting Wiegand rule-->
</isSupportWiegandRuleCfg>
<isSupportM1CardEncryptCfg>
Intelligent Security API (Access Control on Person) Developer Guide
## 310

<!--opt, xs:boolean, whether it supports M1 card encryption authentication-->
</isSupportM1CardEncryptCfg>
<isSupportDeployInfo>
<!--opt, xs:boolean, whether it supports getting arming information-->
</isSupportDeployInfo>
<isSupportSubmarineBack>
<!--opt, xs:boolean, whether it supports specifying anti-passing back server-->
</isSupportSubmarineBack>
<isSupportSubmarineBackHostInfo>
<!--opt, xs:boolean, whether it supports setting access controllers with anti-passing back enabled-->
</isSupportSubmarineBackHostInfo>
<isSupportStartReaderInfo>
<!--opt, xs:boolean, whether it supports setting first card reader-->
</isSupportStartReaderInfo>
<isSupportSubmarineBackReader>
<!--opt, xs:boolean, whether it supports setting anti-passing back card reader-->
</isSupportSubmarineBackReader>
<isSupportServerDevice>
<!--opt, xs:boolean, whether it supports setting anti-passing back server information-->
</isSupportServerDevice>
<isSupportReaderAcrossHost>
<!--opt, xs:boolean, whether it supports enabling cross-controller anti-passing back function of card reader-->
</isSupportReaderAcrossHost>
<isSupportClearCardRecord>
<!--opt, xs:boolean, whether it supports clearing card swiping records in anti-passing back server-->
</isSupportClearCardRecord>
<isSupportSubmarineBackMode>
<!--opt, xs:boolean, whether it supports setting anti-passing back mode-->
</isSupportSubmarineBackMode>
<isSupportClearSubmarineBack>
<!--opt, xs:boolean, whether it supports clearing cross-controller anti-passing back information-->
</isSupportClearSubmarineBack>
<isSupportRemoteControlDoor>
<!--opt, xs:boolean, whether it supports remote door, elevator, and lock control: "true"-yes, this node is not
returned-no-->
</isSupportRemoteControlDoor>
<isSupportUserInfo><!--opt, xs:boolean, whether it supports person management based on person--></
isSupportUserInfo>
<EmployeeNoInfo><!--dep, employee No. (person ID) information, this node is valid only when the
isSupportUserInfo is "true"-->
<employeeNo min="" max=""><!--opt, employee No. (person ID)--></employeeNo>
<characterType opt="any,number">
<!--opt, employee No. (person) ID type: "any"-any characters (default), "number"-digits (from 0 to 9), only one
value can be returned-->
</characterType>
<isSupportCompress>
<!--opt, xs:boolean, whether it supports compressing employee No. (person) ID for storage: "true"-yes, this node is
not returned-no-->
</isSupportCompress>
</EmployeeNoInfo>
<isSupportCardInfo><!--opt, xs:boolean, whether it supports card management based on person: "true"-yes, this
node is not returned-no--></isSupportCardInfo>
Intelligent Security API (Access Control on Person) Developer Guide
## 311

<isSupportUserInfoDetailDelete><!--opt, xs:boolean, whether it supports deleting person information and
permission: "true"-yes, this node is not returned-no--></isSupportUserInfoDetailDelete>
<isSupportAuthCodeInfo>
<!--opt, xs:boolean, whether it supports authentication password management: "true"-yes, this node is not
returned-no-->
</isSupportAuthCodeInfo>
<isSupportFingerPrintCfg>
<!--opt, xs:boolean, whether it supports configuring fingerprint parameters: "true"-yes, this node is not returned-
no-->
</isSupportFingerPrintCfg>
<isSupportFingerPrintDelete>
<!--opt, xs:boolean, whether it supports deleting fingerprint: "true"-yes, this node is not returned-no-->
</isSupportFingerPrintDelete>
<isSupportCaptureFingerPrint>
<!--opt, xs:boolean, whether it supports collecting fingerprint information: "true"-yes, this node is not returned-no--
## >
</isSupportCaptureFingerPrint>
<isSupportDoorStatusWeekPlanCfg>
<!--opt, xs:boolean, whether it supports configuring door control week schedule: "true"-yes, this node is not
returned-no-->
</isSupportDoorStatusWeekPlanCfg>
<isSupportVerifyWeekPlanCfg>
<!--opt, xs:boolean, whether it supports configuring week schedule of the card reader authentication mode: "true"-
yes, this node is not returned-no-->
</isSupportVerifyWeekPlanCfg>
<isSupportCardRightWeekPlanCfg>
<!--opt, xs:boolean, whether it supports configuring week schedule of the access permission control: "true"-yes, this
node is not returned-no-->
</isSupportCardRightWeekPlanCfg>
<isSupportDoorStatusHolidayPlanCfg>
<!--opt, xs:boolean, whether it supports configuring door control holiday schedule: "true"-yes, this node is not
returned-no-->
</isSupportDoorStatusHolidayPlanCfg>
<isSupportVerifyHolidayPlanCfg>
<!--opt, xs:boolean, whether it supports configuring holiday schedule of the card reader authentication mode:
"true"-yes, this node is not returned-no-->
</isSupportVerifyHolidayPlanCfg>
<isSupportCardRightHolidayPlanCfg>
<!--opt, xs:boolean, whether it supports configuring holiday schedule of the access permission control: "true"-yes,
this node is not returned-no-->
</isSupportCardRightHolidayPlanCfg>
<isSupportDoorStatusHolidayGroupCfg>
<!--opt, xs:boolean, whether it supports configuring holiday group of the door control schedule: "true"-yes, this
node is not returned-no-->
</isSupportDoorStatusHolidayGroupCfg>
<isSupportVerifyHolidayGroupCfg>
<!--opt, xs:boolean, whether it supports configuring holiday group of the control schedule of the card reader
authentication mode: "true"-yes, this node is not returned-no-->
</isSupportVerifyHolidayGroupCfg>
<isSupportUserRightHolidayGroupCfg>
<!--opt, xs:boolean, whether it supports configuring holiday group of the access permission control schedule: "true"-
yes, this node is not returned-no-->
Intelligent Security API (Access Control on Person) Developer Guide
## 312

</isSupportUserRightHolidayGroupCfg>
<isSupportDoorStatusPlanTemplate>
<!--opt, xs:boolean, whether it supports configuring door control schedule template: "true"-yes, this node is not
returned-no-->
</isSupportDoorStatusPlanTemplate>
<isSupportVerifyPlanTemplate>
<!--opt, xs:boolean, whether it supports configuring schedule template of the card reader authentication mode:
"true"-yes, this node is not returned-no-->
</isSupportVerifyPlanTemplate>
<isSupportUserRightPlanTemplate>
<!--opt, xs:boolean, whether it supports configuring schedule template of the access permission control: "true"-yes,
this node is not returned-no-->
</isSupportUserRightPlanTemplate>
<isSupportDoorStatusPlan>
<!--opt, xs:boolean, whether it supports configuring door control schedule: "true"-yes, this node is not returned-no--
## >
</isSupportDoorStatusPlan>
<isSupportCardReaderPlan>
<!--opt, xs:boolean, whether it supports configuring control schedule of the card reader authentication mode:
"true"-yes, this node is not returned-no-->
</isSupportCardReaderPlan>
<isSupportClearPlansCfg>
<!--opt, xs:boolean, whether it supports clearing the access control schedule parameters: "true"-yes, this node is
not returned-no-->
</isSupportClearPlansCfg>
<isSupportRemoteControlBuzzer>
<!--opt, xs:boolean, whether it supports remotely controlling the buzzer of the card reader: "true"-yes, this node is
not returned-no-->
</isSupportRemoteControlBuzzer>
<isSupportEventCardNoList>
<!--opt, xs:boolean, whether it supports getting the list of event and card linkage ID: "true"-yes, this node is not
returned-no-->
</isSupportEventCardNoList>
<isSupportEventCardLinkageCfg>
<!--opt, xs:boolean, whether it supports configuring event and card linkage parameters: "true"-yes, this node is not
returned-no-->
</isSupportEventCardLinkageCfg>
<isSupportClearEventCardLinkageCfg>
<!--opt, xs:boolean, whether it supports clearing event and card linkage parameters: "true"-yes, this node is not
returned-no-->
</isSupportClearEventCardLinkageCfg>
<isSupportAcsEvent>
<!--opt, xs:boolean, whether it supports searching for access control events: "true"-yes, this node is not returned-
no-->
</isSupportAcsEvent>
<isSupportAcsEventTotalNum>
<!--opt, xs:boolean, whether it supports getting total number of access control events by specific conditions: "true"-
yes, this node is not returned-no-->
</isSupportAcsEventTotalNum>
<isSupportDeployInfo>
<!--opt, xs:boolean, whether it supports getting the arming information: "true"-yes, this node is not returned-no-->
</isSupportDeployInfo>
Intelligent Security API (Access Control on Person) Developer Guide
## 313

<isSupportEventOptimizationCfg>
<!--opt, xs:boolean, whether it supports configuring event optimization: "true"-yes, this node is not returned-no-->
</isSupportEventOptimizationCfg>
<isSupportAcsWorkStatus>
<!--opt, xs:boolean, whether it supports getting working status of the access control device: "true"-yes, this node is
not returned-no-->
</isSupportAcsWorkStatus>
<isSupportDoorCfg>
<!--opt, xs:boolean, whether it supports configuring door parameters: "true"-yes, this node is not returned-no-->
</isSupportDoorCfg>
<isSupportCardReaderCfg>
<!--opt, xs:boolean, whether it supports configuring card reader parameters: "true"-yes, this node is not returned-
no-->
</isSupportCardReaderCfg>
<isSupportAcsCfg>
<!--opt, xs:boolean, whether it supports configuring parameters of access control device: "true"-yes, this node is not
returned-no-->
</isSupportAcsCfg>
<isSupportGroupCfg>
<!--opt, xs:boolean, whether it supports configuring group parameters: "true"-yes, this node is not returned-no-->
</isSupportGroupCfg>
<isSupportClearGroupCfg>
<!--opt, xs:boolean, whether it supports clearing group parameters: "true"-yes, this node is not returned-no-->
</isSupportClearGroupCfg>
<isSupportMultiCardCfg>
<!--opt, xs:boolean, whether it supports configuring multiple authentication mode: "true"-yes, this node is not
returned-no-->
</isSupportMultiCardCfg>
<isSupportMultiDoorInterLockCfg>
<!--opt, xs:boolean, whether it supports configuring multi-door interlocking parameters: "true"-yes, this node is not
returned-no-->
</isSupportMultiDoorInterLockCfg>
<isSupportAntiSneakCfg>
<!--opt, xs:boolean, whether it supports configuring anti-passing back parameters in the device: "true"-yes, this
node is not returned-no-->
</isSupportAntiSneakCfg>
<isSupportCardReaderAntiSneakCfg>
<!--opt, xs:boolean, whether it supports configuring anti-passing back parameters for the card reader in the device:
"true"-yes, this node is not returned-no-->
</isSupportCardReaderAntiSneakCfg>
<isSupportClearAntiSneakCfg>
<!--opt, xs:boolean, whether it supports clearing anti-passing back parameters: "true"-yes, this node is not returned-
no-->
</isSupportClearAntiSneakCfg>
<isSupportClearAntiSneak>
<!--opt, xs:boolean, whether it supports clearing anti-passing back records in the device: "true"-yes, this node is not
returned-no-->
</isSupportClearAntiSneak>
<isSupportSmsRelativeParam>
<!--opt, xs:boolean, whether it supports configuring message function: "true"-yes, this node is not returned-no-->
</isSupportSmsRelativeParam>
<isSupportPhoneDoorRightCfg>
Intelligent Security API (Access Control on Person) Developer Guide
## 314

<!--opt, xs:boolean, whether it supports configuring the door permission linked to the mobile phone number:
"true"-yes, this node is not returned-no-->
</isSupportPhoneDoorRightCfg>
<isSupportOSDPStatus>
<!--opt, xs:boolean, whether it supports searching for OSDP card reader status: "true"-yes, this node is not returned-
no-->
</isSupportOSDPStatus>
<isSupportOSDPModify>
<!--opt, xs:boolean, whether it supports editing OSDP card reader ID: "true"-yes, this node is not returned-no-->
</isSupportOSDPModify>
<isSupportLogModeCfg>
<!--opt, xs:boolean, whether it supports configuring log mode: "true"-yes, this node is not returned-no-->
</isSupportLogModeCfg>
<FactoryReset>
<isSupportFactoryReset><!--opt, xs: boolean, whether it supports restoring to default settings by condition--></
isSupportFactoryReset>
<mode opt="full,basic,part"><!--opt, xs: string, conditions for restoring to default settings--></mode>
</FactoryReset>
<isSupportNFCCfg><!--opt, xs:boolean，whether it supports enabling or disabling NFC function: "true"-yes, this node
is not returned-no--></isSupportNFCCfg>
<isSupportRFCardCfg><!--opt, xs:boolean，whether it supports enabling or disabling RF card recognition: "true"-yes,
this node is not returned-no--></isSupportRFCardCfg>
<isSupportCaptureFace>
<!--opt, xs:boolean, whether it supports collecting face pictures: "true"-yes, this node is not returned-no-->
</isSupportCaptureFace>
<isSupportCaptureInfraredFace>
<!--opt, xs:boolean, whether it supports collecting infrared face pictures: "true"-yes, this node is not returned-no-->
</isSupportCaptureInfraredFace>
<isSupportFaceRecognizeMode>
<!--opt, xs:boolean, whether it supports configuring facial recognition mode: "true"-yes, this node is not returned-
no-->
</isSupportFaceRecognizeMode>
<isSupportRemoteControlPWChcek>
<!--opt, xs:boolean, whether it supports verifying the password for remote door control: "true"-yes, this node is not
returned-no-->
</isSupportRemoteControlPWChcek>
<isSupportRemoteControlPWCfg>
<!--opt, xs:boolean, whether it supports configuring the password for remote door control: "true"-yes, this node is
not returned-no-->
</isSupportRemoteControlPWCfg>
<isSupportAttendanceStatusModeCfg>
<!--opt, xs:boolean, whether it supports configuring attendance mode: "true"-yes, this node is not returned-no-->
</isSupportAttendanceStatusModeCfg>
<isSupportAttendanceStatusRuleCfg>
<!--opt, xs:boolean, whether it supports configuring attendance status and rule: "true"-yes, this node is not
returned-no-->
</isSupportAttendanceStatusRuleCfg>
<isSupportCaptureCardInfo>
<!--opt, xs:boolean, whether it supports collecting card information: "true"-yes, this node is not returned-no-->
</isSupportCaptureCardInfo>
<isSupportCaptureIDInfo>
<!--opt, xs:boolean, whether it supports collecting ID card information: "true"-yes, this node is not returned-no-->
Intelligent Security API (Access Control on Person) Developer Guide
## 315

</isSupportCaptureIDInfo>
<isSupportCaptureRule>
<!--opt, xs:boolean, whether it supports configuring online collection rules: "true"-yes, this node is not returned-no--
## >
</isSupportCaptureRule>
<isSupportCapturePresetParam>
<!--opt, xs:boolean, whether it supports configuring preset parameters of online collection: "true"-yes, this node is
not returned-no-->
</isSupportCapturePresetParam>
<isSupportOfflineCapture>
<!--opt, xs:boolean, whether it supports offline collection: "true"-yes, this node is not returned-no-->
</isSupportOfflineCapture>
<isSupportCardOperations>
<!--opt, xs:boolean, whether it supports card operation: "true"-yes, this node is not returned-no-->
</isSupportCardOperations>
<isSupportRightControllerAudio>
<!--optional, xs:boolean, whether it supports configuring audio file parameters of the main controller-->
</isSupportRightControllerAudio>
<isSupportChannelControllerCfg>
<!--optional, xs:boolean, whether it supports configuring lane controller-->
</isSupportChannelControllerCfg>
<isSupportGateDialAndInfo>
<!--optional, xs:boolean, whether it supports getting local DIP and information of the turnstile-->
</isSupportGateDialAndInfo>
<isSupportGateStatus>
<!--optional, xs:boolean, whether it supports getting turnstile status-->
</isSupportGateStatus>
<isSupportGateIRStatus>
<!--optional, xs:boolean, whether it supports getting  the status of the active infrared intrusion detector of the
turnstile-->
</isSupportGateIRStatus>
<isSupportGateRelatedPartsStatus>
<!--optional, xs:boolean, whether it supports getting related components' status of the turnstile-->
</isSupportGateRelatedPartsStatus>
<isSupportChannelControllerAlarmLinkage>
<!--optional, xs:boolean, whether it supports configuring alarm linkage of the lane controller-->
</isSupportChannelControllerAlarmLinkage>
<isSupportChannelControllerAlarmOut>
<!--optional, xs:boolean, whether it supports configuring alarm output of the lane controller-->
</isSupportChannelControllerAlarmOut>
<isSupportChannelControllerAlarmOutControl>
<!--optional, xs:boolean, whether it supports controlling alarm output of the lane controller-->
</isSupportChannelControllerAlarmOutControl>
<isSupportChannelControllerTypeCfg>
<!--optional, xs:boolean, whether it supports configuring device type of the lane controller-->
</isSupportChannelControllerTypeCfg>
<isSupportTTSText><!--optional, xs:boolean, whether it supports configuring the text of the audio prompt: true-yes.
If this function is not supported, this node will be not returned--></isSupportTTSText>
<isSupportIDBlackListCfg><!--optional, xs:boolean, whether it supports applying ID card blacklist: true-yes. If this
function is not supported, this node will be not returned--></isSupportIDBlackListCfg>
<isSupportUserDataImport><!--optional, xs:boolean, whether it supports importing person permission data: true-
yes. If this function is not supported, this node will be not returned--></isSupportUserDataImport>
Intelligent Security API (Access Control on Person) Developer Guide
## 316

<isSupportUserDataExport><!--optional, xs:boolean, whether it supports exporting person permission data: true-yes.
If this function is not supported, this node will be not returned--></isSupportUserDataExport>
<isSupportMaintenanceDataExport><!--optional, xs:boolean, whether it supports exporting maintenance data: true-
yes. If this function is not supported, this node will be not returned--></isSupportMaintenanceDataExport>
<isSupportLockTypeCfg><!--optional, xs:boolean, whether it supports configuring door lock status when the device is
powered off: true-yes. If this function is not supported, this node will be not returned--></isSupportLockTypeCfg>
</AccessControl>
6.2.6 XML_Cap_CaptureFaceData
CaptureFaceData capability message in XML format
<CaptureFaceData version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<CaptureFaceDataCond>
<captureInfrared opt="true,false"><!--req, xs:boolean, whether to collect infrared face data--></captureInfrared>
<dataType opt="url,binary"><!--opt, xs:string, data type of collected face pictures: "url" (default), "binary"--
><dataType>
</CaptureFaceDataCond>
<faceDataUrl min="1" max="768">
<!--dep, xs:string, face data URL, if this node does not exist, it indicates that there is no face data-->
</faceDataUrl>
<captureProgress min="0" max="100">
<!--req, xs:integer,
collection progress, which is between 0 and 100, 0-no face data collected, 100-collected, the face
data URL can be parsed only when the progress is 100-->
</captureProgress>
<isCurRequestOver opt="true,false">
<!--opt, xs:boolean, whether the current collection request is completed: "true"-yes, "false"-no-->
</isCurRequestOver>
<infraredFaceDataUrl min="1" max="100">
<!--req, xs:string, infrared face picture URL, if this node does not exist, it indicates that there is no infrared face
data-->
</infraredFaceDataUrl>
</CaptureFaceData>
6.2.7 XML_Cap_CaptureFingerPrint
CaptureFingerPrint capability message in XML format
<CaptureFingerPrint version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<CaptureFingerPrintCond><!--req, xs: integer, finger No.-->
<fingerNo min="1" max="10"></fingerNo>
</CaptureFingerPrintCond>
<fingerData min="1" max="768"><!--dep, xs:string, fingerprint data--></fingerData>
<fingerNo min="1" max="10"><!--req, xs:integer, finger No.--></fingerNo>
<fingerPrintQuality min="1" max="100"><!--req, xs:integer, fingerprint quality--></fingerPrintQuality>
</CaptureFingerPrint>
Intelligent Security API (Access Control on Person) Developer Guide
## 317

6.2.8 XML_Cap_ClearCardRecord
ClearCardRecord capability message in XML format
<ClearCardRecord version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<clearAllCard opt="true,false">
<!--req, xs: boolean, whether to clear all card swiping records in the cross-controller anti-passing back server-->
</clearAllCard>
<CardList size="32">
<cardNo min="1" max="32"><!--opt, xs: string, card No.--></cardNo>
</CardList>
<EmployeeNoList size="32">
<employeeNo min="" max=""><!--opt, xs:string, employee No. (person ID)--></employeeNo>
</EmployeeNoList>
</ClearCardRecord>
6.2.9 XML_Cap_ClearSubmarineBack
ClearSubmarineBack capability message in XML format
<ClearSubmarineBack version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<clearHostInfo opt="true,false"><!--opt, xs: boolean, whether to clear access controller information--></
clearHostInfo>
<clearReaderInfo opt="true,false"><!--opt, xs: boolean, whether to clear card reader information--></
clearReaderInfo>
<clearSubmarineBack opt="true,false"><!--opt, xs: boolean, whether to clear anti-passing back server parameters--
></clearSubmarineBack>
<clearSubmarineBackHostInfo opt="true,false">
<!--opt, xs: boolean, whether to clear cross-controller anti-passing back parameters of access controllers-->
</clearSubmarineBackHostInfo>
<clearStartReaderInfo opt="true,false"><!--opt, xs: boolean, whether to clear first card reader parameters--></
clearStartReaderInfo>
<clearSubmarineBackReader opt="true,false">
<!--opt, xs: boolean, whether to clear cross-controller anti-passing back parameters of card readers-->
</clearSubmarineBackReader>
<clearSubmarineBackMode opt="true,false">
<!--opt, xs: boolean, whether to clear the cross-controller anti-passing back mode parameters-->
</clearSubmarineBackMode>
<clearServerDevice opt="true,false"><!--opt, xs: boolean, whether to clear the parameters of cross-controller anti-
passing back server--></clearServerDevice>
<clearReaderAcrossHost opt="true,false">
<!--opt, xs: boolean, whether to clear the cross-controller anti-passing back status of card readers-->
</clearReaderAcrossHost>
</ClearSubmarineBack>
Intelligent Security API (Access Control on Person) Developer Guide
## 318

6.2.10 XML_Cap_DeployInfo
DeployInfo capability message in XML format
<DeployInfo version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<DeployList size="5">
<Content>
<deployNo min="" max=""><!--req, xs: integer, arming No.--></deployNo>
<deployType opt="0,1,2"><!--req, xs: integer, arming type: 0-client arming to receive real-time or offline events via
platform or system (based on Hikvision private protocol), 1-real-time arming to receive real-time events (based on
Hikvision private protocol), 2-arm based on ISAPI protocol--></deployType>
<ipAddr min="" max=""><!--req, xs: string, IP address--></ipAddr>
</Content>
</DeployList>
</DeployInfo>
6.2.11 XML_Cap_DoorParam
DoorParam capability message in XML format
<DoorParam version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<doorNo min="" max="">
<!--opt, xs:integer, door No.-->
</doorNo>
<doorName min="1" max="32">
<!--opt, xs:string, door name-->
</doorName>
<magneticType opt="alwaysClose,alwaysOpen">
<!--opt, xs:string, magnetic contact type: "alwaysClose"-remain locked, "alwaysOpen"-remain unlocked-->
</magneticType>
<openButtonType opt="alwaysClose,alwaysOpen">
<!--opt, xs:string, door button type: "alwaysClose"-remain locked, "alwaysOpen"-remain unlocked-->
</openButtonType>
<openDuration min="1" max="255">
<!--opt, xs:integer, door open duration (floor relay action time), unit: second-->
</openDuration>
<disabledOpenDuration min="1" max="255">
<!--opt, xs:integer, door open duration by card for disabled person (delay duration of closing the door), unit:
second-->
</disabledOpenDuration>
<magneticAlarmTimeout min="0" max="255">
<!--opt, xs:integer, alarm time of magnetic contact detection timeout, which is between 0 and 255, 0 refers to not
triggering alarm, unit: second-->
</magneticAlarmTimeout>
<enableDoorLock opt="true,false">
<!--opt, xs:boolean, whether to enable locking door when the door is closed-->
</enableDoorLock>
<enableLeaderCard opt="true,false">
<!--opt, xs:boolean, whether to enable remaining open with first card. This node is invalid when leaderCardMode is
Intelligent Security API (Access Control on Person) Developer Guide
## 319

configured-->
</enableLeaderCard>
<leaderCardMode opt="disable,alwaysOpen,authorize">
<!--opt, xs:string, first card mode: "disable", "alwaysOpen"-remain open with first card, "authorize"-first card
authentication. If this node is configured, the node <enableLeaderCard> is invalid-->
</leaderCardMode>
<leaderCardOpenDuration min="1" max="1440">
<!--opt, xs:integer, duration of remaining open with first card, unit: second-->
</leaderCardOpenDuration>
<stressPassword min="1" max="8">
<!--wo, opt, xs:string, duress password, the maximum length is 8 bytes, and the duress password should be encoded
by Base64 for transmission-->
</stressPassword>
<superPassword min="1" max="8">
<!--wo, opt, xs:string, super password, the maximum length is 8 bytes, and the super password should be encoded
by Base64 for transmission-->
</superPassword>
<unlockPassword min="1" max="8">
<!--wo, opt, xs:string, dismiss password, the maximum length is 8 bytes, and the dismiss password should be
encoded by Base64 for transmission-->
</unlockPassword>
<useLocalController opt="true,false">
<!--ro, opt, xs:boolean, whether it is connected to the distributed controller-->
</useLocalController>
<localControllerID min="0" max="64">
<!--ro, opt, xs:integer, distributed controller No., which is between 1 and 64, 0-unregistered-->
</localControllerID>
<localControllerDoorNumber min="0" max="4">
<!--ro, opt, xs:integer, distributed controller door No., which is between 1 and 4, 0-unregistered-->
</localControllerDoorNumber>
<localControllerStatus opt="0,1,2,3,4,5,6,7,8,9">
<!--ro, opt, xs:integer, online status of the distributed controller: 0-offline, 1-network online, 2-RS-485 serial port 1
on loop circuit 1, 3-RS-485 serial port 2 on loop circuit 1, 4-RS-485 serial port 1 on loop circuit 2, 5-RS-485 serial port 2
on loop circuit 2, 6-RS-485 serial port 1 on loop circuit 3, 7-RS-485 serial port 2 on loop circuit 3, 8-RS-485 serial port 1
on loop circuit 4, 9-RS-485 serial port 2 on loop circuit 4-->
</localControllerStatus>
<lockInputCheck opt="true,false">
<!--opt, xs:boolean, whether to enable door lock input detection-->
</lockInputCheck>
<lockInputType opt="alwaysClose,alwaysOpen">
<!--opt, xs:string, door lock input type: "alwaysClose"-remain locked (default), "alwaysOpen"-remain unlocked-->
</lockInputType>
<doorTerminalMode opt="preventCutAndShort,preventCutAndShort,common">
<!--opt, xs:string, working mode of door terminal: "preventCutAndShort"-prevent from broken-circuit and short-
circuit (default), "common"-->
</doorTerminalMode>
<openButton opt="true,false">
<!--opt, xs:boolean, whether to enable door button: "true"-yes (default), "false"-no-->
</openButton>
<ladderControlDelayTime min="1" max="255">
<!--opt, xs:integer, elevator control delay time (for visitor), which is between 1 and 255, unit: minute-->
</ladderControlDelayTime>
Intelligent Security API (Access Control on Person) Developer Guide
## 320

<remoteControlPWStatus opt="true,false">
<!--ro, opt, xs:boolean, whether the password has been configured for remote door control-->
</remoteControlPWStatus>
</DoorParam>
6.2.12 XML_Cap_FaceCompareCond
XML message about condition configuration capability of face picture comparison
<FaceCompareCond version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<faceWidthLowerLimit min="" max="">
<!--optional, xs:integer, face width threshold with highest priority, value range: [0, 100], when the detected face
width is larger than this threshold, the following conditions will be ignored and the face comparison will be executed--
## >
</faceWidthLowerLimit>
<pitch min="" max=""><!--optional, xs:integer, face raising or bowing angle, value range: [0, 90], unit: degree, the
smaller the better--></pitch>
<yaw min="" max=""><!--optional, xs:integer, face siding left or right angle, value range: [0, 90], unit: degree, the
smaller the better--></yaw>
<width min="" max=""><!--optional, xs:integer, face width, value range: [0, 100]--></width>
<height min="" max=""><!--optional, xs:integer, face height, value range: [0, 100]--></height>
<leftBorder min="" max=""><!--optional, xs:integer, left border of face, value range: [0, 100]--></leftBorder>
<rightBorder min="" max=""><!--optional, xs:integer, right border of face, value range: [0, 100]--></rightBorder>
<upBorder min="" max=""><!--optional, xs:integer, top border of face, value range: [0, 100]--></upBorder>
<bottomBorder min="" max=""><!--optional, xs:integer, bottom border of face, value range: [0, 100]--></
bottomBorder>
<interorbitalDistance min="" max=""><!--optional, xs:integer, pupil distance, value range: [0, 100]--></
interorbitalDistance>
<faceScore min="" max=""><!--optional, xs:integer, face score, value range: [0, 100], the valid face score must be
larger than this score--></faceScore>
<maxDistance opt="0.5,1,1.5,2,auto"><!--optional, xs:string, maximum recognition distance: "0.5,1,1.5,2,auto", unit:
m. This node has higher priority over <interorbitalDistance>--></maxDistance>
</FaceCompareCond>
6.2.13 XML_Cap_IDBlackListCfg
IDBlackListCfg capability message in XML format
<IDBlackListCfg version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<blackListValid opt ="0,1">
<!--req, xs:integer, ID card in blacklist status: 0-invalid, 1-valid, which is used to deleting ID card in blacklist by card
number-->
</blackListValid>
<IDCardInfo><!—dep-->
<name min="" max=""><!--name--></name>
<birth><!--date of birth--></birth>
<addr min="" max=""><!--address--></addr>
<IDNum min="" max=""><!--ID card number--></IDNum>
<issuingAuthority min="" max=""><!--issued by--></issuingAuthority>
Intelligent Security API (Access Control on Person) Developer Guide
## 321

<startDate><!--start date of expiry date--></startDate>
<endDate><!--end date of expiry date--></endDate>
<termOfValidity opt ="true,false">
<!--whether the expiry date is permanent: false-no, true-yes (the <endDate> is invalid)-->
</termOfValidity>
<sex opt ="male,female"><!--gender: male or female--></sex>
<nation><!--nationality, reserved--></nation>
</IDCardInfo>
</IDBlackListCfg>
6.2.14 XML_Cap_IdentityTerminal
IdentityTerminal capability message in XML format
<IdentityTerminal version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<terminalMode opt="authMode,registerMode">
<!--req, xs: string, terminal mode: "authMode"-authentication mode, "registerMode"-registration mode-->
</terminalMode>
<idCardReader opt="iDR210,DS-K1F110-I,DS-K1F1110-B，DS-K1F1110-AB, none">
<!--req, xs: string,ID card reader model-->
</idCardReader>
<camera opt="C270,DS-2CS5432B-S"><!--req, xs: string, camera--></camera>

<fingerPrintModule opt="ALIWARD,HikModule"><!--req, xs: string, fingerprint module--></fingerPrintModule>
<videoStorageTime min="0" max="10"><!--req, xs: integer, time for saving video (unit: second)--></
videoStorageTime>
<faceContrastThreshold min="0" max="100"><!--req, xs: integer, face picture comparison threshold--></
faceContrastThreshold>
<twoDimensionCode opt="enable,disable"><!--req, xs: string, whether to enable QR code recognition--></
twoDimensionCod>
<blackListCheck opt="enable,disable"><!--req, xs: string, whether to enable blacklist verification--></blackListCheck>
<idCardCheckCenter opt="local,server">
<!--req, xs: string, ID card comparison mode: local-compare with ID card of local storage, server-compare with ID
card of remote server storage-->
</idCardCheckCenter>
<faceAlgorithm opt="HIK-Z,HIK-H">
<!--req, xs: string, face picture algorithm: HIK-Z-Hikviison algorithm, HIK-H-third-party algorithm-->
</faceAlgorithm>
<comNo min="1" max="9"><!--req, xs: integer, COM No.--></comNo>
<memoryLearning opt="enable,disable"><!--req, xs: string, whether to enable learning and memory function--></
memoryLearning>
<saveCertifiedImage opt="enable,disable"><!--req, xs: string, whether to enable saving authenticated picture--></
saveCertifiedImage>
<MCUVersion min="" max=""><!--opt, xs: string, MCU version information--></MCUVersion>
<usbOutput opt="enable,disable"><!--req, xs: string, whether to enable USB output of ID card reader--></
usbOutput>
<serialOutput opt="enable,disable"><!--req, xs: string, whether to enable serial port output of ID card reader--></
serialOutput>
<readInfoOfCard opt="serialNo,file"><!--opt, xs: string, set content to be read from CPU card--></readInfoOfCard>
<workMode opt="passMode,accessControlMode"><!--opt, xs: string, authentication mode--></workMode>
<ecoMode>
<eco opt="enable,disable"><!--opt, xs: string, whether to enable ECO mode--></eco>
Intelligent Security API (Access Control on Person) Developer Guide
## 322

<faceMatchThreshold1 min="" max=""><!--req, xs: integer, 1V1 face picture comparison threshold of ECO mode,
which is between 0 and 100--></faceMatchThreshold1>
<faceMatchThresholdN min="" max=""><!--req, xs: integer, 1:N face picture comparison threshold of ECO mode,
which is between 0 and 100--></faceMatchThresholdN>
<changeThreshold min="" max=""><!--opt, xs: string, switching threshold of ECO mode, which is between 0 and 8--
></changeThreshold>
</ecoMode>
<readCardRule opt="wiegand26,wiegand34"><!--opt, xs: string, card No. setting rule: "wiegand26", "wiegand34"--></
readCardRule>
</IdentityTerminal>
6.2.15 XML_Cap_M1CardEncryptCfg
M1CardEncryptCfg capability message in XML format
"http://www.isapi.org/ver20/XMLSchema">
<enable opt="true,false"><!--req, xs:boolean, whether to enable--></enable>
<sectionID min="0" max="100"><!--req, xs:integer, sector ID--></sectionID>
</M1CardEncryptCfg>
6.2.16 XML_Cap_ModuleStatus
Capability message about getting the status of the secure door control unit in XML format
<ModuleStatus version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<securityModuleNo min="1" max="256"><!--required, xs:string, secure door control unit No.--></securityModuleNo>
<onlineStatus opt="0,1"><!--required, xs:integer, online status: 0-offline, 1-online--></onlineStatus>
<desmantelStatus opt="0,1"><!--required, xs:integer, tampering status: 0-not tampered, 1-tampered--></
desmantelStatus>
</ModuleStatus>
6.2.17 XML_Cap_ReaderAcrossHost
ReaderAcrossHost capability message in XML format
<ReaderAcrossHost version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<AcrossHostList size="8">
<AcrossHostAction>
<readerNo min="1" max="8"><!--req, xs: integer, card reader No.--></readerNo>
<submarineBackEnabled opt="true,false">
<!--req, xs: boolean, whether to enable the cross-controller anti-passing back function of the card reader-->
</submarineBackEnabled>
</AcrossHostAction>
</AcrossHostList>
</ReaderAcrossHost>
Intelligent Security API (Access Control on Person) Developer Guide
## 323

6.2.18 XML_Cap_RemoteControlDoor
RemoteControlDoor capability message in XML format
<RemoteControlDoor version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<doorNo min="" max=""><!--opt, xs:integer, range of the door No.--></doorNo>
<cmd opt="open,close,alwaysOpen,alwaysClose,visitorCallLadder,householdCallLadder">
<!--req, xs:string, command: "open"-open the door, "close"-close the door (controlled), "alwaysOpen"-remain
unlocked (free), "alwaysClose"-remain locked (disabled), "visitorCallLadder"-call elevator (visitor),
"householdCallLadder"-call elevator (resident)-->
## </cmd>
<password min="" max="">
<!--opt, xs:string, password for opening door-->
## </password>
</RemoteControlDoor>
6.2.19 XML_Cap_ServerDevice
ServerDevice capability message in XML format
<ServerDevice version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<ipAddr min="" max=""><!--req, xs: string, IP address of the cross-controller anti-passing back server--></ipAddr>
<port min="" max=""><!--req, xs: string, port No. of the cross-controller anti-passing back server--></port>
</ServerDevice>
## 6.2.20
XML_Cap_SnapConfig
SnapConfig capability message in XML format
<SnapConfig version="2.0"xmlns="http://www.isapi.org/ver20/XMLSchema">
<snapTimes min="0" max="5"><!--req, xs: integer, capture times triggered by loop, the value is between 0 and 5--></
snapTimes>
<snapWaitTime min="0" max="6000">
<!--req, xs: integer, capture waiting time, the value is betweem 0 and 6,000, currently, this node is reserved-->
</snapWaitTime>
<intervalTimeList size="4"><!-- req>
<intervalTime min="0" max="6000"><!--req, xs: integer, time interval of continuous capture, the value is between 0
and 6,000--></intervalTime>
</intervalTimeList>
<JPEGParam>
<pictureSize>
<!--req, xs: string, picture resolution: 0-CIF, 1-QCIF, 2-D1, 3-UXGA (1600 × 1200), 4-SVGA(800 × 600), 5-
HD720p(1280 × 720), 6-VGA, 7-XVGA, 8-HD900p, 9-HD1080, 10-2560 × 1920, 11-1600 × 304，     12-2048 × 1536，
13-2448 × 2048,  14-2448 × 1200， 15-2448 × 800, 16-XGA(1024 × 768), 17-SXGA(1280 × 1024),18-WD1(960 × 576/960
× 480), 19-1080i, 20-576 × 576, 21-1536 × 1536, 22-1920 × 1920, 161-288 × 320, 162-144 × 176, 163-480 × 640,
164-240 × 320, 165-120 × 160, 166-576 × 720, 167-720 × 1280, 168-576 × 960, 180-180*240, 181-360*480,
## 182-540*720, 183-720*960, 184-960*1280, 185-1080*1440, 0xff-auto-->
</pictureSize>
Intelligent Security API (Access Control on Person) Developer Guide
## 324

<pictureQuality opt="best, better, general"><!--req, xs: string, picture quality: "best", "better", "general"--></
pictureQuality>
</JPEGParam>
</SnapConfig>
6.2.21 XML_Cap_StartReaderInfo
StartReaderInfo capability message in XML format
<StartReaderInfo version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<hostNo min="1" max="64"><!--req, xs: integer, access controller No.--></hostNo>
<readerNo min="1" max="8"><!--req, xs: integer, card reader No.--></readerNo>
</StartReaderInfo>
6.2.22 XML_Cap_SubmarineBack
SubmarineBack capability message in XML format
<SubmarineBack version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<enabled opt="true,false"><!--req, xs: boolean, whether to specify this access controller as the cross-controller anti-
passing back server--></enabled>
</SubmarineBack>
6.2.23 XML_Cap_SubmarineBackHostInfo
SubmarineBackHostInfo capability message in XML format
<SubmarineBackHostInfo version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<ID min="1" max="4"><!--req, xs: integer, configuration No.--></ID>
<HostInfoList size="16">
<Action>
<deviceNo min="1" max="64"><!--req, xs: integer, device No.--></deviceNo>
<serial min="9" max="9"><!--req, xs: string, device serial No.--></serial>
</Action>
</HostInfoList>
</SubmarineBackHostInfo>
6.2.24 XML_Cap_SubmarineBackMode
SubmarineBackMode capability message in XML format
<SubmarineBackMode version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<mode opt="disable,internetCommunicate,cardReadAndWrite"><!--req, xs:string, anti-passing back mode--></mode>
<rule opt="line,inOrOut">
<!--req, xs:string, anti-passing back rule, this node is invalid when the mode is set to "disable"-->
## </rule>
Intelligent Security API (Access Control on Person) Developer Guide
## 325

<sectionID min="1" max="100">
<!--req, xs:integer, section ID, this node is valid when mode is "cardReadAndWrite", and only one section ID can be
configured for one configuration-->
</sectionID>
</SubmarineBackMode>
6.2.25 XML_Cap_SubmarineBackReader
SubmarineBackReader capability message in XML format
<SubmarineBackReader version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<ID min="1" max="128"><!--req, xs:integer, configuration No.--></ID>
<selfHostNo min="1" max="64"><!--req, xs:integer, access control No. of the configuration object--></selfHostNo>
<selfReaderNo min="1" max="8"><!--req, xs:integer, card reader No. of the configuration object--></selfReaderNo>
<FollowReaderList size="16">
<Action>
<followHostNo min="1" max="64"><!--req, xs:integer, following access controller No.--></followHostNo>
<followReaderNo min="1" max="8"><!--req, xs:integer, following card reader No.--></followReaderNo>
</Action>
</FollowReaderList>
</SubmarineBackReader>
6.2.26 XML_Cap_WiegandCfg
WiegandCfg capability message in XML format
<WiegandCfg version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<wiegandNo min="1" max="64"><!--required, xs:integer, Wiegand interface No.--></wiegandNo>
<communicateDirection opt="receive,send"><!--required, xs:string, communication direction: "receive", "send"--></
communicateDirection>
<wiegandMode opt="wiegand26,wiegand34,wiegand27,wiegand35"><!--dependent, xs:string, Wiegand mode:
"wiegand26", "wiegand34", "wiegand27", "wiegand35". This node is valid when <communicateDirection> is "send"--
></wiegandMode>
<signalInterval min="1" max="20"><!--optional, xs:integer, interval of sending Wiegand signals, it is between 1 and
20, unit: ms--></signalInterval>
<enable opt="true,false"><!--optional, xs:boolean, whether to enable Wiegand parameters: true, false--></enable>
</WiegandCfg>
6.2.27 XML_Cap_WiegandRuleCfg
WiegandRuleCfg capability message in XML format
<WiegandRuleCfg version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<name min="" max="">
<!--req, xs:string, Wiegand name-->
## </name>
<CustomerCardIn>
Intelligent Security API (Access Control on Person) Developer Guide
## 326

<totalLength min="" max="">
<!--req, xs:integer, total Wiegand length. When this node is set to 0, the custom Wiegand rule settings will be
cleared-->
</totalLength>
<checkMethod opt="parityCheck,xorCheck,noCheck">
<!--req, xs:string, parity mode: "parityCheck,xorCheck,noCheck"-->
</checkMethod>
<ParityCheck>
<!--dep, configuration rule of odd-even parity, this node is valid when <checkMethod> is "parityCheck"-->
<oddBeginBit min="" max="">
<!--dep, xs:integer, start bit of odd parity-->
</oddBeginBit>
<oddLength min="" max="">
<!--dep, xs:integer, odd parity length-->
</oddLength>
<evenBeginBit min="" max="">
<!--dep, xs:integer, start bit of even parity-->
</evenBeginBit>
<evenLength min="" max="">
<!--dep, xs:integer, even parity length-->
</evenLength>
</ParityCheck>
<XorCheck>
<!--dep, configuration rule of XOR parity, this node is valid when <checkMethod> is "xorCheck"-->
<xorBeginBit min="" max="">
<!--dep, xs:integer, start bit of XOR parity-->
</xorBeginBit>
<xorPerLength min="" max="">
<!--dep, xs:integer, length of each XOR parity group-->
</xorPerLength>
<xorTotalLength min="" max="">
<!--dep, xs:integer, total length of XOR parity data-->
</xorTotalLength>
</XorCheck>
<cardIdBeginBit min="" max="">
<!--req, xs:integer, start bit of the card No.-->
</cardIdBeginBit>
<cardIdLength min="" max="">
<!--req, xs:integer, card No. length-->
</cardIdLength>
<siteCodeBeginBit min="" max="">
<!--req, xs:integer, start bit of the site code-->
</siteCodeBeginBit>
<siteCodeLength min="" max="">
<!--req, xs:integer, site code length-->
</siteCodeLength>
<oemBeginBit min="" max="">
<!--req, xs:integer, start bit of OEM-->
</oemBeginBit>
<oemLength min="" max="">
<!--req, xs:integer, OEM length-->
</oemLength>
Intelligent Security API (Access Control on Person) Developer Guide
## 327

<manufacturerCodeBeginBit min="" max="">
<!--req, xs:integer, start bit of the manufacturer code-->
</manufacturerCodeBeginBit>
<manufacturerCodeLength min="" max="">
<!--req, xs:integer, manufacturer code length-->
</manufacturerCodeLength>
</CustomerCardIn>
<CustomerCardOut>
<CardContentList size="4">
<!--This node contains multiple <Action> nodes, and the <type> node in each <Action> node can only be set to
one type. The order of the types will determine the combination order of the rules-->
<Action>
<No min="" max="">
<!--req, xs:integer, No.-->
</No>
<type opt="cardId,siteCode,oem,manufacturerCode">
<!--req, xs:string, type: "cardId"-card ID, "siteCode"-site code, "oem"-OEM No., "manufacturerCode"-
manufacturer code-->
## </type>
<length min="" max="">
<!--req, xs:integer, length of the corresponding decimal data-->
## </length>
</Action>
</CardContentList>
</CustomerCardOut>
</WiegandRuleCfg>
6.2.28 XML_ClearCardRecord
ClearCardRecord message in XML format
<ClearCardRecord version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<clearAllCard>
<!--req, xs: boolean, whether to clear all card swiping records in the cross-controller anti-passing back server: "true"-
yes, "false"-no. If this node is set to "false", either CardList or EmployeeNoList is required. If CardList is configured, it
indicates clearing card swiping records by card No.; if EmployeeNoList is configured, it indicates clearing card swiping
records by employee No.-->
</clearAllCard>
<CardList size="32">
<cardNo><!--opt, xs: string, card No., min="1" max="32"--></cardNo>
</CardList>
<EmployeeNoList size="32">
<employeeNo><!--opt, xs:string, employee No. (person ID)--></employeeNo>
</EmployeeNoList>
</ClearCardRecord>
Intelligent Security API (Access Control on Person) Developer Guide
## 328

6.2.29 XML_ClearSubmarineBack
ClearSubmarineBack message in XML format
<ClearSubmarineBack version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<clearHostInfo><!--opt, xs: boolean, whether to clear access controller information: "true,false"--></clearHostInfo>
<clearReaderInfo><!--opt, xs: boolean, whether to clear card reader information: "true,false"--></clearReaderInfo>
<clearSubmarineBack><!--opt, xs: boolean, whether to clear anti-passing back server parameters: "true,false"--></
clearSubmarineBack>
<clearSubmarineBackHostInfo>
<!--opt, xs: boolean, whether to clear cross-controller anti-passing back parameters of access controllers:
## "true,false"-->
</clearSubmarineBackHostInfo>
<clearStartReaderInfo><!--opt, xs: boolean, whether to clear first card reader parameters: "true,false"--></
clearStartReaderInfo>
<clearSubmarineBackReader>
<!--opt, xs: boolean, whether to clear cross-controller anti-passing back parameters of card readers: "true,false"-->
</clearSubmarineBackReader>
<clearSubmarineBackMode>
<!--opt, xs: boolean, whether to clear the cross-controller anti-passing back mode parameters: "true,false"-->
</clearSubmarineBackMode>
<clearServerDevice>
<!--opt, xs: boolean, whether to clear the parameters of cross-controller
anti-passing back server: "true,false"-->
</clearServerDevice>
<clearReaderAcrossHost>
<!--opt, xs: boolean, whether to clear the cross-controller anti-passing back status of card readers: "true,false"-->
</clearReaderAcrossHost>
</ClearSubmarineBack>
6.2.30 XML_DeployInfo
DeployInfo message in XML format
<DeployInfo version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<DeployList size="5">
<Content>
<deployNo><!--req, xs: integer, arming No.--></deployNo>
<deployType><!--req, xs: integer, arming type: 0-client arming to receive real-time or offline events via platform or
system (based on Hikvision private protocol), 1-real-time arming to receive real-time events (based on Hikvision
private protocol), 2-arm based on ISAPI protocol, opt="0,1,2"--></deployType>
<ipAddr><!--req, xs: string, IP address--></ipAddr>
</Content>
</DeployList>
</DeployInfo>
Intelligent Security API (Access Control on Person) Developer Guide
## 329

6.2.31 XML_DoorParam
DoorParam message in XML format
<DoorParam version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<doorName>
<!--opt, xs:string, door name-->
</doorName>
<magneticType>
<!--opt, xs:string, magnetic contact type: "alwaysClose"-remain locked, "alwaysOpen"-remain unlocked-->
</magneticType>
<openButtonType>
<!--opt, xs:string, door button type: "alwaysClose"-remain locked, "alwaysOpen"-remain unlocked-->
</openButtonType>
<openDuration>
<!--opt, xs:integer, door open duration (floor relay action time), which is between 1 and 255, unit: second-->
</openDuration>
<disabledOpenDuration>
<!--opt, xs:integer, door open duration by card for disabled person (delay duration of closing the door), which is
between 1 and 255, unit: second-->

</disabledOpenDuration>
<magneticAlarmTimeout>
<!--opt, xs:integer, alarm time of magnetic contact detection timeout, which is between 0 and 255, 0 refers to not
triggering alarm, unit: second-->
</magneticAlarmTimeout>
<enableDoorLock>
<!--opt, xs:boolean, whether to enable locking door when the door is closed-->
</enableDoorLock>
<enableLeaderCard>
<!--opt, xs:boolean, whether to enable remaining open with first card. This node is invalid when leaderCardMode is
configured-->
</enableLeaderCard>
<leaderCardMode>
<!--opt, xs:string, first card mode: "disable", "alwaysOpen"-remain open with first card, "authorize"-first card
authentication. If this node is configured, the node <enableLeaderCard> is invalid-->
</leaderCardMode>
<leaderCardOpenDuration>
<!--opt, xs:integer, duration of remaining open with first card, which is between 1 and 1440, unit: second-->
</leaderCardOpenDuration>
<stressPassword>
<!--wo, opt, xs:string, duress password, the maximum length is 8 bytes, and the duress password should be encoded
by Base64 for transmission-->
</stressPassword>
<superPassword>
<!--wo, opt, xs:string, super password, the maximum length is 8 bytes, and the super password should be encoded
by Base64 for transmission-->
</superPassword>
<unlockPassword>
<!--wo, opt, xs:string, dismiss password, the maximum length is 8 bytes, and the dismiss password should be
encoded by Base64 for transmission-->
</unlockPassword>
Intelligent Security API (Access Control on Person) Developer Guide
## 330

<useLocalController>
<!--ro,opt, xs:boolean, whether it is connected to the distributed controller-->
</useLocalController>
<localControllerID>
<!--ro, opt, xs:integer, distributed controller No., which is between 1 and 64, 0-unregistered-->
</localControllerID>
<localControllerDoorNumber>
<!--ro, opt, xs:integer, distributed controller door No., which is between 1 and 4, 0-unregistered-->
</localControllerDoorNumber>
<localControllerStatus>
<!--ro, opt, xs:integer, online status of the distributed controller: 0-offline, 1-network online, 2-RS-485 serial port 1
on loop circuit 1, 3-RS-485 serial port 2 on loop circuit 1, 4-RS-485 serial port 1 on loop circuit 2, 5-RS-485 serial port 2
on loop circuit 2, 6-RS-485 serial port 1 on loop circuit 3, 7-RS-485 serial port 2 on loop circuit 3, 8-RS-485 serial port 1
on loop circuit 4, 9-RS-485 serial port 2 on loop circuit 4-->
</localControllerStatus>
<lockInputCheck>
<!--opt, xs:boolean, whether to enable door lock input detection-->
</lockInputCheck>
<lockInputType>
<!--opt, xs:string, door lock input type: "alwaysClose"-remain locked (default), "alwaysOpen"-remain unlocked-->
</lockInputType>
<doorTerminalMode>
<!--opt, xs:string, working mode of door terminal: "preventCutAndShort"-prevent from broken-circuit and short-
circuit (default), "common"-->
</doorTerminalMode>
<openButton>
<!--opt, xs:boolean, whether to enable door button: "true"-yes (default), "false"-no-->
</openButton>
<ladderControlDelayTime>
<!--opt, xs:integer, elevator control delay time (for visitor), which is between 1 and 255, unit: minute-->
</ladderControlDelayTime>
<remoteControlPWStatus>
<!--ro, opt, xs:boolean, whether the password has been configured for remote door control-->
</remoteControlPWStatus>
</DoorParam>
6.2.32 XML_EventCap
EventCap capability message in XML format
<EventCap version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<isSupportHDFull><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportHDFull>
<isSupportHDError><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportHDError>
<isSupportNicBroken><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportNicBroken>
<isSupportIpConflict><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportIpConflict>
<isSupportIllAccess><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportIllAccess>
<isSupportViException><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportViException>
<isSupportViMismatch><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportViMismatch>
<isSupportRecordException><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportRecordException>
<isSupportTriggerFocus><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportTriggerFocus>
<isSupportMotionDetection><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportMotionDetection>
Intelligent Security API (Access Control on Person) Developer Guide
## 331

<isSupportVideoLoss><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportVideoLoss>
<isSupportTamperDetection><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportTamperDetection>
<isSupportStudentsStoodUp><!--opt, xs:boolean, "true"-support, "false"-not support--></
isSupportStudentsStoodUp>
<isSupportFramesPeopleCounting><!--opt, xs:boolean, "true"-support, "false"-not support--></
isSupportFramesPeopleCounting>
<isSupportRaidException><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportRaidException>
<isSupportSpareException><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportSpareException>
<isSupportPoePowerException><!--opt, xs:boolean, "true"-support, "false"-not support--></
isSupportPoePowerException>
<isSupportRegionEntrance><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportRegionEntrance>
<isSupportRegionExiting><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportRegionExiting>
<isSupportLoitering><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportLoitering>
<isSupportGroup><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportGroup>
<isSupportRapidMove><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportRapidMove>
<isSupportFireDetection><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportFireDetection>
<isSupportillegalParking><!--opt, xs:boolean, whether it supports illegal parking detection: "true"-support, "false"-
not support--></isSupportillegalParking>
<isSupportUnattendedBaggage><!--opt, xs:boolean --></isSupportUnattendedBaggage>
<isSupportAttendedBaggage><!--opt, xs:boolean, "true"-support, "false"-not support--></
isSupportAttendedBaggage>
<isSupportHumanAttribute><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportHumanAttribute>
<isSupportFaceContrast><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportFaceContrast>
<isSupportFaceLib><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportFaceLib>
<isSupportWhiteListFaceContrast><!--opt, xs:boolean, "true"-support, "false"-not support--></
isSupportWhiteListFaceContrast>
<isSupportBlackListFaceContrast><!--opt, xs:boolean, whether it supports blacklist face comparison: "true"-support,
"false"-not support--></isSupportBlackListFaceContrast>
<isSupportHumanRecognition>><!--opt, xs:boolean, "true"-support, "false"-not support--></
isSupportHumanRecognition>
<isSupportFaceSnap><!--opt, xs:boolean, "true"-support, "false"-not support--></isSupportFaceSnap>
<isSupportPersonDensityDetection><!--opt, xs:boolean, "true"-support, "false"-not support--></
isSupportPersonDensityDetection>
<isSupportMixedTargetDetection><!--opt, xs:boolean, whether it supports multi-target-type detection alarm: "true"-
support, "false"-not support--></isSupportMixedTargetDetection>
<isSupportPedestrian><!--opt, xs:boolean, whether it supports pedestrian detection: "true"-support, "false"-not
support--></isSupportPedestrian>
<isSupportTrafficAccident><!--opt, xs:boolean, whether it supports traffic accident detection: "true"-support, "false"-
not support--></isSupportTrafficAccident>
<isSupportConstruction><!--opt, xs:boolean, whether it supports construction detection: "true"-support, "false"-not
support--></isSupportConstruction>
<isSupportRoadBlock><!--opt, xs:boolean, whether it supports roadblock detection: "true"-support, "false"-not
support--></isSupportRoadBlock>
<isSupportAbandonedObject><!--opt, xs:boolean, whether it supports thrown object detection: "true"-support,
"false"-not support--></isSupportAbandonedObject>
<isSupportParallelParking><!--opt, xs:boolean, whether it supports parallel parking detection: "true"-support, "false"-
not support--></isSupportParallelParking>
<isSupportParkingState><!--opt, xs:boolean, whether it supports parking space status detection: "true"-support,
"false"-not support, currently this node is not supported--></isSupportParkingState>
<isSupportCongestion><!--opt, xs:boolean, whether it supports congestion detection: "true"-support, "false"-not
support--></isSupportCongestion>
<isSupportVehicleStatistics><!--opt, xs:boolean, whether it supports data collection: "true"-support, "false"-not
Intelligent Security API (Access Control on Person) Developer Guide
## 332

support--></isSupportVehicleStatistics>
<isSupportWrongDirection><!--opt, xs:boolean, whether it supports wrong-way driving detection: "true"-support,
"false"-not support--></isSupportWrongDirection>
<isSupportTrunRound><!--opt, xs:boolean, whether it supports U-turning detection: "true"-support, "false"-not
support--></isSupportTrunRound>
<isSupportCrossLane><!--opt, xs:boolean, whether it supports driving on the lane line detection: "true"-support,
"false"-not support--></isSupportCrossLane>
<isSupportLaneChange><!--opt, xs:boolean, whether it supports illegal lane change detection: "true"-support, "false"-
not support--></isSupportLaneChange>
<isSupportVehicleExist><!--opt, xs:boolean, whether it supports motor vehicle on non-motor vehicle lane detection:
"true"-support, "false"-not support--></isSupportVehicleExist>
<isSupporFogDetection><!--opt, xs:boolean, whether it supports fog detection: "true"-support, "false"-not support--
></isSupporFogDetection>
<isSupportIntersectionAnalysis><!--opt, xs: boolean, whether it supports configuring intersection analysis alarm:
"true"-support, "false"-not support--></isSupportIntersectionAnalysis>
<isSupportVoltageInstable><!--opt,xs:boolean, whether it supports supply voltage exception alarm: "true"-support,
"false"-not support--></isSupportVoltageInstable>
<isSupportSafetyHelmetDetection><!--opt, xs:boolean, whether it supports hard hat detection: "true"-support,
"false"-not support--></isSupportSafetyHelmetDetection>
<isSupportCertificateRevocation><!--opt, xs:boolean, whether it supports certificate expiry alarm--></
isSupportCertificateRevocation>
</EventCap>
## 6.2.33
XML_EventNotificationAlert_HeartbeatInfo
EventNotificationAlert message with heartbeat information (when there is no alarm is triggered) in
XML format
<EventNotificationAlert version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<ipv6Address><!--dep, xs:string, device IPv6 address--></ipv6Address>
<portNo><!--opt, xs:integer, device port number--></portNo>
<protocol><!--opt, xs:string, protocol type for uploading alarm/event information, "HTTP,HTTPS"--></protocol>
<macAddress><!--opt, xs:string, MAC address--></macAddress>
<channelID><!--dep, xs:string, device channel No., starts from 1--></channelID>
<dateTime><!--req, heartbeat uploaded time, format: 2017-07-19T10:06:41+08:00--></dateTime>
<activePostCount><!--req, xs:integer, heartbeat frequency, starts from 1--></activePostCount>
<eventType><!--req, xs:string, for heartbeat, it is "videoloss"--></eventType>
<eventState>
<!--req, xs:string, for heartbeat, it is "inactive"-->
</eventState>
<eventDescription><!--req, xs: string, description--></eventDescription>
</EventNotificationAlert>
## Remarks
•For network camera or network speed dome with the version 5.5.0 and lower, the heartbeat
frequency is 300 ms per heartbeat.
•For network camera or network speed dome with the version 5.5.0 and higher, the heartbeat
frequency is 10 s per heartbeat. If no heartbeat received for
continuous 30 s, it indicates that the
heartbeat is
timed out.
Intelligent Security API (Access Control on Person) Developer Guide
## 333

## Example
Message Example of Heartbeat
<EventNotificationAlert version="2.0" xmlns="http://www.isapi.com/ver20/XMLSchema">
<ipAddress>10.17.133.46</ipAddress>
<portNo>80</portNo>
<protocol>HTTP</protocol>
<macAddress>44:19:b6:6d:24:85</macAddress>
<channelID>1</channelID>
<dateTime>2017-05-04T11:20:02+08:00</dateTime>
<activePostCount>0</activePostCount>
<eventType>videoloss</eventType>
<eventState>inactive</eventState>
<eventDescription>videoloss alarm</eventDescription>
</EventNotificationAlert>
## 6.2.34
XML_EventNotificationAlert_AlarmEventInfo
EventNotificationAlert message with alarm/event information in XML format.
<EventNotificationAlert version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<ipAddress><!--dep, xs:string, device IPv4 address--></ipAddress>
<ipv6Address><!--dep, xs:string, device IPv6 address--></ipv6Address>
<portNo><!--opt, xs:integer, device port number--></portNo>
<protocol><!--opt, xs:string, protocol type for uploading alarm/event information, "HTTP,HTTPS"--></protocol>
<macAddress><!--opt, xs:string, MAC address--></macAddress>
<channelID><!--dep, xs:string, device channel No., starts from 1--></channelID>
<dateTime><!--req, alarm/event triggered or occurred time, format: 2017-07-19T10:06:41+08:00--></dateTime>
<activePostCount><!--req, xs:integer, alarm/event frequency, starts from 1--></activePostCount>
<eventType><!--req, xs:string, alarm/event type, "peopleCounting, ANPR,..."--></eventType>
<eventState>
<!--req, xs:string, durative alarm/event status: "active"-valid, "inactive"-invalid, e.g., when a moving target is
detected,
the alarm/event information will be uploaded continuously unit the status is set to "inactive"-->
</eventState>
<eventDescription><!--req, xs:string, alarm/event description--></eventDescription>
<...><!--opt, for different alarm/event types, the nodes are different, see the message examples in different
applications--></...>
</EventNotificationAlert>
6.2.35 XML_EventTrigger
EventTrigger message in XML format
<EventTrigger version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<id><!--req, xs:string, ID--></id>
<eventType>
<!--req, xs:string, see details in the "Remarks" below-->
</eventType>
Intelligent Security API (Access Control on Person) Developer Guide
## 334

<eventDescription><!--opt, xs:string--></eventDescription>
<inputIOPortID><!--dep, xs:string, alarm input ID--></inputIOPortID>
<dynInputIOPortID><!--dep, xs:string, dynamic alarm input ID--></dynInputPortID>
<videoInputChannelID>
<!--dep, xs:string, video input channel ID, it is valid when <eventType> is "VMD, videoloss, tamperdetection,
regionEntrance, regionExiting, loitering, group, rapidMove, parking, unattendedBaggage, attendedBaggage"-->
</videoInputChannelID>
<dynVideoInputChannelID><!--dep, xs:string, dynamic video input channel ID--></dynVideoInputChannelID>
<intervalBetweenEvents><!--opt, xs:integer, event time interval, unit: second--></intervalBetweenEvents>
<WLSensorID><!--dep, xs:string, ID--></WLSensorID>
<EventTriggerNotificationList/><!--opt, alarm/event linkage actions, see details in the message of
XML_EventTriggerNotificationList-->
</EventTrigger>
## Remarks
The node <eventType> can be the following values: IO, VMD, videoloss, raidfailure,
recordingfailure, badvideo, POS, analytics, fanfailure, overheat, tamperdetection, diskfull, diskerror,
nicbroken,
ipconflict, illaccess, videomismatch, resolutionmismatch, radifailure, PIR, WLSensor,
spareException, poePowerException, heatmap, counting, linedetection, fielddetection,
regionEntrance, regionExiting, loitering, group,rapidMove, parking, unattendedBaggage,
attendedBaggage, HUMANATTRIBUTE, blackList, whitelist, peopleDetection, allVehicleList,
otherVehicleList, vehicledetection, storageDetection, shipsDetection, humanAttribute,
faceContrast, blackListFaceContrast, whiteListFaceContrast, faceSnap, faceLib,
personDensityDetection, personQueueDetecton, mixedTargetDetection, HVTVehicleDetection,
illegalParking, pedestrian, trafficAccident, construction, roadblock, abandonedObject,
parallelParking, parkingState,
congestion, intersectionAnalysis, heatMap, thermometry,
shipsFlowDetection, dredgerDetection, reverseEntrance, luma, highHDTemperature,
lowHDTemperature, hdImpact, hdBadBlock, SevereHDFailure,
safetyHelmetDetection.
## See Also
XML_EventTriggerNotificationList
6.2.36 XML_EventTriggerCapType
XML message about capability of alarm linkage action types
<EventTriggerCapType version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<isSupportCenter><!--optional, xs:boolean--></isSupportCenter>
<isSupportRecord><!--optional, xs:boolean--></isSupportRecord>
<isSupportMonitorAlarm><!--optional, xs:boolean--></isSupportMonitorAlarm>
<isSupportBeep><!--optional, xs: boolean, whether it supports audible warning--></isSupportBeep>
<isSupportIO><!--optional, xs:boolean--></isSupportIO>
<isSupportFTP><!--optional, xs:boolean--></isSupportFTP>
<isSupportEmail><!--optional, xs:boolean--></isSupEmail>
<isSupportLightAudioAlarm><!--optional, xs:boolean--></isSupportLightAudioAlarm>
<isSupportFocus><!--optional, xs:boolean--></isSupportFocus>
<isSupportPTZ><!--optional, xs:boolean--></isSupportPTZ>
Intelligent Security API (Access Control on Person) Developer Guide
## 335

<maxPresetActionNum>
<!--dependent, xs:integer, it is valid only when <isSupportPTZ> is "true"-->
</maxPresetActionNum>
<maxPatrolActionNum>
<!--dependent, xs:integer, it is valid only when <isSupportPTZ> is "true"-->
</maxPatrolActionNum>
<maxPatternActionNum>
<!--dependent, xs:integer, it is valid only when <isSupportPTZ> is "true"-->
</maxPatternActionNum>
<isSupportTrack><!--optional, xs:boolean, whether it supports PTZ linked tracking--></isSupportTrack>
<isSupportWhiteLight>
<!--optional, xs: boolean, whether it supports supplement light alarm linkage-->
</isSupportWhiteLight>
<isSupportCloud><!--optional, xs:boolean, whether it supports upload to the cloud--></isSupportCloud>
<targetNotificationInterval max="1000" min="0" default="30"><!--xs:integer, range: [0, 1000], the default value is 30,
unit: seconds, this node is valid for <MotionDetectionTriggerCap> and <TamperDetectionTriggerCap> and this node is
valid when <isSupportPTZ> is "true"--></targetNotificationInterval>
<direction opt="both,forward,reverse"><!--xs:string, triggering direction, this node is valid for the node
<BlackListTriggerCap>, <WhiteListTriggerCap>, and <VehicleDetectionTriggerCap>--></direction>
<presetDurationTime min="" max=""><!--dependent, xs:integer--></presetDurationTime>
<isSupportSMS><!--optional, xs:boolean, whether to support SMS (Short Message Service)--></isSupportSMS>
<maxCellphoneNum><!--dependent, xs:integer, the maximum number of cellphones, which is node is valid only
when <isSupportSMS> is "true"--></maxCellphoneNum>
<isSupportOSD><!--optional, xs:boolean--></isSupportOSD>
<isSupportAudio><!--optional, xs:boolean, whether it supports setting audio alarm independently. If this node is set
to "true", audio alarm and buzzer alarm can be linked separately, and the linage method is audio--></isSupportAudio>
<AudioAction><!--dependent, this node is valid when <isSupportBeep> is "true" or <isSupportAudio> is "true"-->
<audioTypeList>
<audioType><!--list-->
<audioID><!--required, xs:integer, alarm sound type--></audioID>
<audioDescription><!--required, xs:string, alarm sound description, it should correspond to the alarm sound type--
></audioDescription>
</audioType>
</audioTypeList>
<alarmTimes opt="0,1,2,3,4,5,6,7,8,9,255"><!--required, xs:integer, alarm times, it is between 0 and 9, 255-
continuous alarm, unit: time--></alarmTimes>
</AudioAction>
<isSupportSMS><!--optional, xs:boolean --></isSupportSMS>
<maxCellphoneNum><!--dependent, if <isSupportSMS> is true, xs:integer--></maxCellphoneNum>
<isNotSupportCenterModify><!--optional, xs:boolean, whether editing configuration parameters of the surveillance
center is not supported: "true"-yes (configuration parameters of the surveillance center cannot be edited), "false" or
this node is not returned-no (configuration parameters of the surveillance center can be edited)--></
isNotSupportCenterModify>
<isSupportMessageConfig>
<!--optional, xs:boolean, whether it supports SMS configuration, if supports, set cellphoneNumber to null-->
</isSupportMessageConfig>
<isSupportAnalogOutput><!--optional, xs:boolean, whether it supports IO output of linkage analog channel--></
isSupportAnalogOutput>
<isSupportIOOutputUnify><!--optional, xs:boolean, whether it supports configuration of IO output--></
isSupportIOOutputUnify>
<isSupportFaceContrast><!--optional, xs:boolean, whether it supports face picture comparison linkage--></
Intelligent Security API (Access Control on Person) Developer Guide
## 336

isSupportFaceContrast>
</EventTriggerCapType>
6.2.37 XML_EventTriggerList
EventTriggerList message in XML format
<EventTriggerList version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<EventTrigger/><!--opt, see details in the message of XML_EventTrigger-->
</EventTriggerList>
## See Also
XML_EventTrigger
## Example
XML_EventTriggerList Message Example of Linkage
Configurations of Multiple Alarms
<EventTriggerList version="2.0" xmlns="http://www.hikvision.com/ver20/XMLSchema">
<EventTrigger>
<id>VMD-1</id>
<eventType>VMD</eventType>

<eventDescription>VMD Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList></EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>tamper-1</id>
<eventType>tamperdetection</eventType>
<eventDescription>shelteralarm Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList></EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>diskfull</id>
<eventType>diskfull</eventType>
<eventDescription>exception Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList></EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>diskerror</id>
<eventType>diskerror</eventType>
<eventDescription>exception Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
Intelligent Security API (Access Control on Person) Developer Guide
## 337

## <id>beep</id>
<notificationMethod>beep</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>nicbroken</id>
<eventType>nicbroken</eventType>
<eventDescription>exception Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList></EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>ipconflict</id>
<eventType>ipconflict</eventType>
<eventDescription>exception Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList></EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>illaccess</id>
<eventType>illaccess</eventType>
<eventDescription>exception Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList></EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>videomismatch</id>
<eventType>videomismatch</eventType>
<eventDescription>exception Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>beep</id>
<notificationMethod>beep</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>badvideo</id>
<eventType>badvideo</eventType>
<eventDescription>exception Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList></EventTriggerNotificationList>
</EventTrigger>
Intelligent Security API (Access Control on Person) Developer Guide
## 338

<EventTrigger>
<id>storageDetection-1</id>
<eventType>storageDetection</eventType>
<eventDescription>storageDetection Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList></EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
<id>illegalParking-1</id>
<eventType>illegalParking</eventType>
<eventDescription>illegalParking Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>center</id>
<notificationMethod>center</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>pedestrian-1</id>
<eventType>pedestrian</eventType>
<eventDescription>pedestrian Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>center</id>
<notificationMethod>center</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
<id>trafficAccident-1</id>
<eventType>trafficAccident</eventType>
<eventDescription>trafficAccident Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>center</id>
<notificationMethod>center</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
## <id>construction-1</id>
Intelligent Security API (Access Control on Person) Developer Guide
## 339

<eventType>construction</eventType>
<eventDescription>construction Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>center</id>
<notificationMethod>center</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
<id>roadBlock-1</id>
<eventType>roadBlock</eventType>
<eventDescription>roadBlock Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>center</id>
<notificationMethod>center</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
<id>abandonedObject-1</id>
<eventType>abandonedObject</eventType>
<eventDescription>abandonedObject Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>center</id>
<notificationMethod>center</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
<id>parallelParking-1</id>
<eventType>parallelParking</eventType>
<eventDescription>parallelParking Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>center</id>
<notificationMethod>center</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
Intelligent Security API (Access Control on Person) Developer Guide
## 340

</EventTriggerNotificationList>
</EventTrigger>
<EventTrigger>
<id>trafficJam-1</id>
<eventType>trafficJam</eventType>
<eventDescription>trafficJam Event trigger Information</eventDescription>
<videoInputChannelID>1</videoInputChannelID>
<dynVideoInputChannelID>1</dynVideoInputChannelID>
<EventTriggerNotificationList>
<EventTriggerNotification>
## <id>center</id>
<notificationMethod>center</notificationMethod>
<notificationRecurrence>beginning</notificationRecurrence>
</EventTriggerNotification>
</EventTriggerNotificationList>
</EventTrigger>
</EventTriggerList>
## 6.2.38
XML_EventTriggerNotification
Event linkage notification message in XML format
<EventTriggerNotification><!--opt-->
<id><!--required, xs:string, device ID--></id>
<notificationMethod>
<!--required, xs:string, linkage actions, opt="email,IM,IO,syslog,HTTP,FTP,beep,ptz,record, monitorAlarm, center,
LightAudioAlarm,focus,trace,cloud,SMS,whiteLight,audio,whiteLight,faceContrast"-->
</notificationMethod>
<notificationRecurrence>
<!--optional, xs:string, "beginning,beginningandend,recurring"-->
</notificationRecurrence>
<notificationInterval><!--dependent, xs:integer, unit: millisecond--></notificationInterval>
<outputIOPortID><!--dependent, xs:string, video output No., it is required only when notificationMethod is "IO"--></
outputIOPortID>
<dynOutputIOPortID><!--dependent, xs:string, dynamic video output No., it is required only when
notificationMethod is "IO"--></dynOutputIOPortID>
<videoInputID><!--dependent, xs:string, video input No., it is required only when notificationMethod is "record"--></
videoInputID>
<dynVideoInputID><!--dependent, xs:string, dynamic video input No., it is required only when notificationMethod is
"record"--></dynVideoInputID>
<ptzAction><!--dependent, it is required only when notificationMethod is "ptz"-->
<ptzChannelID><!--required, xs:string, PTZ channel ID--></ptzChannelID>
<actionName><!--required, xs:string, PTZ control type: "preset", "pattern", "patrol"--></actionName>
<actionNum><!--dependent, xs:integer></actionNum>
</ptzAction>
<WhiteLightAction><!--dependent, white light linkage parameters, this node is valid when notificationMethod is
"whiteLight"-->
<whiteLightDurationTime><!--required, xs:integer, white light flashing duration, it is between 1 and 60, unit:
second--></whiteLightDurationTime>
</WhiteLightAction>
Intelligent Security API (Access Control on Person) Developer Guide
## 341

<cellphoneNumber><!--dependent, xs:string, min="0" max="11",cellphone number--></cellphoneNumber-->
</EventTriggerNotification>
6.2.39 XML_EventTriggerNotificationList
EventTriggerNotificationList message in XML format
<EventTriggerNotificationList version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<EventTriggerNotification/><!--opt, see details in the message of XML_EventTriggerNotification-->
</EventTriggerNotificationList>
## See Also
XML_EventTriggerNotification
6.2.40 XML_EventTriggersCap
EventTriggersCap capability message in XML format
<EventTriggersCap version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<DiskfullTriggerCap><!--opt, xs: EventTriggerCapType--></DiskfullTriggerCap>
<DiskerrorTriggerCap><!--opt, xs: EventTriggerCapType--></DiskerrorTriggerCap>
<NicbrokenTriggerCap><!--opt, xs: EventTriggerCapType--></NicbrokenTriggerCap>
<IpconflictTriggerCap><!--opt, xs: EventTriggerCapType--></IpconflictTriggerCap>
<IllaccesTriggerCap><!--opt, xs: EventTriggerCapType--></IllaccesTriggerCap>
<BadvideoTriggerCap><!--opt, xs: EventTriggerCapType--></BadvideoTriggerCap>
<VideomismatchTriggerCap><!--opt, xs: EventTriggerCapType--></VideomismatchTriggerCap>
<IOTriggerCap><!--opt, xs: EventTriggerCapType--></IOTriggerCap>
<LineDetectTriggerCap><!--opt, xs: EventTriggerCapType--></LineDetectTriggerCap>
<RegionEntranceTriggerCap><!--opt, xs: EventTriggerCapType--></RegionEntranceTriggerCap>
<RegionExitingTriggerCap><!--opt, xs: EventTriggerCapType--></RegionExitingTriggerCap>
<LoiteringTriggerCap><!--opt, xs: EventTriggerCapType--></LoiteringTriggerCap>
<GroupDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></GroupDetectionTriggerCap>
<RapidMoveTriggerCap><!--opt, xs: EventTriggerCapType--></RapidMoveTriggerCap>
<ParkingTriggerCap><!--opt, xs: EventTriggerCapType--></ParkingTriggerCap>
<UnattendedBaggageTriggerCap><!--opt, xs: EventTriggerCapType--></UnattendedBaggageTriggerCap>
<AttendedBaggageTriggerCap><!--opt, xs: EventTriggerCapType--></AttendedBaggageTriggerCap>
<FireDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></FireDetectionTriggerCap>
<FireDetectionCap><!--opt, xs: EventTriggerCapType--></FireDetectionCap>
<StorageDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></StorageDetectionTriggerCap>
<ShipsDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></ShipsDetectionTriggerCap>
<ThermometryCap><!--opt, xs: EventTriggerCapType--></ThermometryCap>
<VandalProofTriggerCap><!--opt, xs: EventTriggerCapType--></VandalProofTriggerCap>
<BlackListTriggerCap><!--opt, xs: EventTriggerCapType, configuration capability of blacklist arming linkage--></
BlackListTriggerCap>
<WhiteListTriggerCap><!--opt, xs: EventTriggerCapType, configuration capability of whitelist arming linkage--></
WhiteListTriggerCap>
<AllVehicleListTriggerCap><!--opt,xs:EventTriggerCapType, configuration capability of other list arming linkage--></
AllVehicleListTriggerCap>
<OtherVehicleListTriggerCap><!--opt,xs:EventTriggerCapType--></OtherVehicleListTriggerCap>
Intelligent Security API (Access Control on Person) Developer Guide
## 342

<PeopleDetectionTriggerCap><!--opt,xs:EventTriggerCapType--></PeopleDetectionTriggerCap>
<PIRAlarmCap><!--opt, xs: EventTriggerCapType--></PIRAlarmCap>
<TamperDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></TamperDetectionTriggerCap>
<DefocusDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></DefocusDetectionTriggerCap>
<FaceDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></FaceDetectionTriggerCap>
<SceneChangeDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></SceneChangeDetectionTriggerCap>
<VandalProofAlarmCap><!--opt, xs: EventTriggerCapType--></VandalProofAlarmCap>
<JudgmentTriggerCap><!--opt, xs: EventTriggerCapType--></JudgmentTriggerCap>
<FightingTriggerCap><!--opt, xs: EventTriggerCapType--></FightingTriggerCap>
<RisingTriggerCap><!--opt, xs: EventTriggerCapType--></RisingTriggerCap>
<DozingTriggerCap><!--opt, xs: EventTriggerCapType--></DozingTriggerCap>
<CountingTriggerCap><!--opt, xs: EventTriggerCapType--></CountingTriggerCap>
<VideoLossTriggerCap><!--opt, xs: EventTriggerCapType--></VideoLossTriggerCap>
<HideTriggerCap><!--opt, xs:EventTriggerCapType--></HideTriggerCap>
<AlarmInTriggerCap><!--opt, xs: EventTriggerCapType--></AlarmInTriggerCap>
<VehicleDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></VehicleDetectionTriggerCap>
<AudioExceptionCap><!--opt, xs: EventTriggerCapType--></AudioExceptionCap>
<FiledDetectTriggerCap><!--opt, xs: EventTriggerCapType--></FiledDetectTriggerCap>
<MotionDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></MotionDetectionTriggerCap>
<TemperatureCap><!--opt, xs: EventTriggerCapType--></TemperatureCap>
<IntelligentTriggerCap><!--opt, xs: EventTriggerCapType--></IntelligentTriggerCap>
<FaceContrastTriggerCap><!--opt, xs: EventTriggerCapType, face picture comparison alarm linkage--></
FaceContrastTriggerCap>
<PersonDensityDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></PersonDensityDetectionTriggerCap>
<PersonQueueDetectionTriggerCap><!--opt, xs: EventTriggerCapType, queue management alarm linkage--></
PersonQueueDetectionTriggerCap>
<WhiteListFaceContrastTriggerCap><!--opt, xs: EventTriggerCapType--></WhiteListFaceContrastTriggerCap>
<HumanRecognitionTriggerCap><!--opt,xs: EventTriggerCapType--></HumanRecognitionTriggerCap>
<FaceSnapTriggerCap><!--opt, xs: EventTriggerCapType--></FaceSnapTriggerCap>
<isSupportWhiteLightAction>
<!--dep, xs: boolean, see details in EventTriggerCapType, it is valid when isSupportWhiteLight is "true"-->
</isSupportWhiteLightAction>
<isSupportAudioAction>
<!--dep, xs: boolean, see details in EventTriggerCapType, it is valid when isSupportBeep is "true"-->
</isSupportAudioAction>
<HFPDTriggerCap><!--opt, xs: EventTriggerCapType--></HFPDTriggerCap>
<MixedTargetDetectionCap><!--opt, xs: EventTriggerCapType--></MixedTargetDetectionCap>
<HVTVehicleDetectionTriggerCap><!--opt, xs: EventTriggerCapType--></HVTVehicleDetectionTriggerCap>
<VCATriggerCap><!--opt, xs: EventTriggerCapType--></VCATriggerCap>
<PIRCap><!--opt, xs: EventTriggerCapType--></PIRCap>
<IllegalParkingTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports illegal parking detection--></
IllegalParkingTriggerCap>
<PedestrianTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports pedestrian detection--></
PedestrianTriggerCap>
<TrafficAccidentTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports traffic accident detection--></
TrafficAccidentTriggerCap>
<ConstructionTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports construction detection--></
ConstructionTriggerCap>
<RoadBlockTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports roadblock detection--></
RoadBlockTriggerCap>
<AbandonedObjectTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports objects dropped down
detection--></AbandonedObjectTriggerCap>
Intelligent Security API (Access Control on Person) Developer Guide
## 343

<ParallelParkingTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports parallel parking detection--></
ParallelParkingTriggerCap>
<ParkingStateTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports parking space status detection,
currently this node is not supported--></ParkingStateTriggerCap>
<CongestionTriggerCap><!--opt, xs: EventTriggerCapType, whether it supports congestion detection--></
CongestionTriggerCap>
<IntersectionAnalysisCap><!--opt, xs: EventTriggerCapType, whether it supports intersection analysis--></
IntersectionAnalysisCap>
<ShipsFlowDetectionTriggerCap><!--opt,xs:EventTriggerCapType, ship flow detection--></
ShipsFlowDetectionTriggerCap>
<dredgerDetectionTriggerCap><!--opt,xs:EventTriggerCapType, dredger detection--></dredgerDetectionTriggerCap>
<voltageInstableTriggerCap><!--opt,xs:EventTriggerCapType, supply voltage exception--></voltageInstableTriggerCap>
<HighHDTemperatureTriggerCap><!--opt, xs:EventTriggerCapType, HDD high temperature detection--></
HighHDTemperatureTriggerCap>
<LowHDTemperatureTriggerCap><!--opt, xs:EventTriggerCapType, HDD low temperature detection--></
LowHDTemperatureTriggerCap>
<HDImpactTriggerCap><!--opt, xs:EventTriggerCapType, HDD impact detection--></HDImpactTriggerCap>
<HDBadBlockTriggerCap><!--opt, xs:EventTriggerCapType, HDD bad sector detection--></HDBadBlockTriggerCap>
<SevereHDFailureTriggerCap><!--opt, xs:EventTriggerCapType, HDD severe fault detection--></
SevereHDFailureTriggerCap>
<HUMANATTRIBUTECap><!--opt, xs:EventTriggerCapType--></HUMANATTRIBUTECap>
<HumanAttributeTriggerCap><!--opt, xs:EventTriggerCapType, human body attribute--></HumanAttributeTriggerCap>
<BlackListFaceContrastTriggerCap><!--opt, xs:EventTriggerCapType, alarm linkage capability of blacklist face
comparison--></BlackListFaceContrastTriggerCap>
<FaceLibTriggerCap><!--opt, xs:EventTriggerCapType--></FaceLibTriggerCap>
<SafetyHelmetDetectionTriggerCap><!--opt, xs:EventTriggerCapType, alarm linkage capability of hard hat detection--
></SafetyHelmetDetectionTriggerCap>
</EventTriggersCap>
## See Also
XML_EventTriggerCapType
6.2.41 XML_FaceCompareCond
XML message about condition parameters of face picture comparison
<FaceCompareCond version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<faceWidthLowerLimit>
<!--optional, xs:integer, face width threshold with highest priority, value range: [0, 100], when the detected face
width is larger than this threshold, the following conditions will be ignored and the face comparison will be executed--
## >
</faceWidthLowerLimit>
## <pitch>
<!--optional, xs:integer, face raising or bowing angle, value range: [0, 90], unit: degree, the smaller the better-->
## </pitch>
<yaw><!--optional, xs:integer, face siding left or right angle, value range: [0, 90], unit: degree, the smaller the better--
## ></yaw>
<width><!--optional, xs:integer, face width, value range: [0, 100]--></width>
<height><!--optional, xs:integer, face height, value range: [0, 100]--></height>
<leftBorder><!--optional, xs:integer, left border of face, value range: [0, 100]--></leftBorder>
Intelligent Security API (Access Control on Person) Developer Guide
## 344

<rightBorder><!--optional, xs:integer, right border of face, value range: [0, 100]--></rightBorder>
<upBorder><!--optional, xs:integer, top border of face, value range: [0, 100]--></upBorder>
<bottomBorder><!--optional, xs:integer, bottom border of face, value range: [0, 100]--></bottomBorder>
<interorbitalDistance><!--optional, xs:integer, pupil distance, value range: [0, 100]--></interorbitalDistance>
<faceScore><!--optional, xs:integer, face score, value range: [0, 100], the valid face score must be larger than this
score--></faceScore>
<maxDistance><!--optional, xs:string, maximum recognition distance: "0.5,1,1.5,2,auto", unit: m. This node has
higher priority over <interorbitalDistance>--></maxDistance>
</FaceCompareCond>
6.2.42 XML_HttpHostNotification
XML message about parameters of a HTTP listening server
<HttpHostNotification version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<id><!--required, xs:string, ID--></id>
<url><!--required, xs:string, the absolute path, e.g., http://<ipAddress>:<portNo>/<uri>--></url>
<protocolType><!--required, xs:string, "HTTP,HTTPS,EHome"--></protocolType>
<parameterFormatType><!--required, xs:string, alarm/event information format, "XML,JSON"--></
parameterFormatType>
<addressingFormatType><!--required, xs:string, "ipaddress,hostname"--></addressingFormatType>
<hostName><!--dependent, xs:string--></hostName>
<ipAddress><!--dependent, xs:string--></ipAddress>
<ipv6Address><!--dependent, xs:string--></ipv6Address>

<portNo><!--optional, xs:integer--></portNo>
<userName><!--dependent, xs:string--></userName>
<password><!--dependent, xs:string--></password>
<httpAuthenticationMethod><!--required, xs:string, "MD5digest,none"--></httpAuthenticationMethod>
<ANPR><!--optional-->
<detectionUpLoadPicturesType>
<!--optional, xs:string, types of alarm picture to be uploaded: "all, licensePlatePicture, detectionPicture"-->
</detectionUpLoadPicturesType>
## </ANPR>
<eventType optional="AID,TFS,TPS"><!--required, xs:string--></eventType>
<uploadImagesDataType>
<!--optional, xs:string, "URL", "binary" (default), for cloud storage, only "URL" is supported-->
</uploadImagesDataType>
<eventMode><!--optional, xs:string, "all,list"--></eventMode>
<EventList><!--dependent, it is valid only when eventMode is "list"-->
<Event><!--required-->
<type><!--required, xs:string--></type>
</Event>
</EventList>
<channels><!--optional, xs:string, "1,2,3,4..."--></channels>
<SubscribeEvent/><!--optional, event subscription parameters, see details in the message of XML_SubscribeEvent-->
</HttpHostNotification>
Intelligent Security API (Access Control on Person) Developer Guide
## 345

6.2.43 XML_HttpHostNotificationCap
XML message about capability of HTTP listening server
<?xml version="1.0" encoding="utf-8"?>
<HttpHostNotificationCap version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<hostNumber>2</hostNumber>
<urlLen max=""/>
<protocolType opt="HTTP,HTTPS"/>
<parameterFormatType opt="XML,querystring,JSON"/>
<addressingFormatType opt="ipaddress,hostname"/>
<ipAddress opt="ipv4,ipv6"/>
<portNo min="" max=""/>
<userNameLen min="" max=""/>
<passwordLen min="" max=""/>
<httpAuthenticationMethod opt="MD5digest,none"/>
<Extensions>
<intervalBetweenEvents min="" max=""/>
</Extensions>
<uploadImagesDataType opt="URL,binary"/>

<ANPR><!--optional-->
<detectionUpLoadPicturesType opt="all,licensePlatePicture,detectionPicture..."/><!--optional, xs:string, types of
alarm pictures to be uploaded-->
<alarmHttpPushProtocol opt="baseline,custom"/>
## </ANPR>
<httpBroken opt="true,false" def="true" ><!--optional, xs:boolean, whether to enable global ANR: true, false--></
httpBroken>
<SubscribeEventCap>
<heartbeat min="" max=""/><!--optional, heartbeat time interval, unit: second-->
<channelMode opt="all,list"/><!--required, all-subscribe events of all channels, list-subscribe event by channel-->
<eventMode opt="all,list"/><!--required, event subscription mode: all-subscribe all events of all channels, list-
subscribe events by type, channel, and target-->
<!--if the values of the two nodes channelMode and eventMode are both "all", it indicates that the device does not
support subscribe events by type and channel-->
<EventList><!--dependent, alarm uploading mode, this node is valid only when eventMode is "list"-->
<Event><!--required-->
<type><!--required, xs:string, event types--></type>
<pictureURLType opt="binary,localURL,cloudStorageURL" def=""/>
<!--optional, xs:string, transmission format of alarm picture: "binary"-picture binary data, "localURL"-picture URL
from local device, "cloudStorageURL"-picture URL from cloud storage-->
</Event>
</EventList>
<pictureURLType opt="binary,localURL,cloudStorageURL" def=""/>

<!--optional, xs:string, transmission format of all alarm pictures: "binary"-picture binary data (default for camera),
"localURL"-picture URL from local device (default for NVR/DVR), "cloudStorageURL"-picture URL from cloud storage;
this node is in highest priority-->
<ChangedUploadSub>
<interval/><!--optional, xs:integer, the life cycle of arming GUID, unit: second, the default life cycle is 5 minutes; if
the reconnection is not started during the life cycle, a new GUID will be generated-->
<StatusSub>
<all/><!--optional, xs:boolean, whether to subscribe all-->
Intelligent Security API (Access Control on Person) Developer Guide
## 346

<channel/><!--optional, xs:boolean, subscribe channel status, this node is not required when the node all is "true"--
## >
<hd/><!--optional, xs:boolean, subscribe the HDD status, this node is not required when the node all is "true"-->
<capability/><!--optional, xs:boolean, subscribe the capability changed status, this node is not required when the
node all is "true"-->
</StatusSub>
</ChangedUploadSub>
</SubscribeEventCap>
</HttpHostNotificationCap>
6.2.44 XML_HttpHostNotificationList
HttpHostNotificationList message in XML format
<HttpHostNotificationList version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<HttpHostNotification>
<id><!--req, xs:string, ID--></id>
<url><!--req, xs:string--></url>
<protocolType><!--req, xs:string, "HTTP,HTTPS"--></protocolType>
<parameterFormatType><!--req, xs:string, alarm/event
information format, "XML,JSON"--></parameterFormatType>
<addressingFormatType><!--req, xs:string, "ipaddress,hostname"--></addressingFormatType>
<hostName><!--dep, xs:string--></hostName>
<ipAddress><!--dep, xs:string--></ipAddress>
<ipv6Address><!--dep, xs:string--></ipv6Address>
<portNo><!--opt, xs:integer--></portNo>
<userName><!--dep, xs:string--></userName>
<password><!--dep, xs:string--></password>
<httpAuthenticationMethod><!--req, xs:string, "MD5digest,none"--></httpAuthenticationMethod>
<uploadImagesDataType>
<!--opt, xs:string, "URL", "binary" (default), for cloud storage, only "URL" is supported-->
</uploadImagesDataType>
<eventMode><!--opt, xs:string, "all,list"--></eventMode>
<EventList><!--dep, it is valid only when eventMode is "list"-->
<Event><!--req-->
<type><!--req, xs:string--></type>
</Event>
</EventList>
<channels><!--opt, xs:string, "1,2,3,4..."--></channels>
</HttpHostNotification>
</HttpHostNotificationList>
## Example
HttpHostNotificationList Message Example
<HttpHostNotificationList version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<HttpHostNotification>
## <id>1</id>
## <url></url>
<protocolType>HTTP</protocolType>
<parameterFormatType>XML</parameterFormatType>
<addressingFormatType>ipaddress</addressingFormatType>
Intelligent Security API (Access Control on Person) Developer Guide
## 347

<ipAddress>0.0.0.0</ipAddress>
<portNo>80</portNo>
<userName></userName>
<httpAuthenticationMethod>none</httpAuthenticationMethod>
</HttpHostNotification>
</HttpHostNotificationList>
6.2.45 XML_HttpHostTestResult
HttpHostTestResult message in XML format.
<HttpHostTestResult version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<errorDescription>
<!--req, xs:string-->
</errorDescription>
</HttpHostTestResult>
6.2.46 XML_IDBlackListCfg
IDBlackListCfg message in XML format
<IDBlackListCfg version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<blackListValid>
<!--req, xs:integer, ID card in blacklist status: 0-invalid, 1-valid, which is used to deleting ID card in blacklist by card
number-->
</blackListValid>
<IDCardInfo><!--dep-->
## <name><!--name--></name>
<birth><!--date of birth--></birth>
## <addr><!--address--></addr>
<IDNum><!--ID card number--></IDNum>
<issuingAuthority><!--issued by--></issuingAuthority>
<startDate><!--start date of expiry date--></startDate>
<endDate><!--end date of expiry date--></endDate>
<termOfValidity>
<!--whether the expiry date is permanent: false-no, true-yes (the <endDate> is invalid)-->
</termOfValidity>
<sex><!--gender: male or female--></sex>
<nation><!--nationality, reserved--></nation>
</IDCardInfo>
</IDBlackListCfg>
## 6.2.47
XML_IdentityTerminal
IdentityTerminal message in XML format
Intelligent Security API (Access Control on Person) Developer Guide
## 348

<IdentityTerminal version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<terminalMode>
<!--req, xs: string, terminal mode: "authMode"-authentication mode, "registerMode"-registration mode-->
</terminalMode>
<idCardReader>
<!--req, xs: string, ID card reader model: iDR210, DS-K1F110-I, DS-K1F1110-B, DS-K1F1110-AB, none, DS-K1F1001-
I(USB), DS-K1F1002-I(USB), none-->
</idCardReader>
<camera><!--req, xs: string, camera model: C270, DS-2CS5432B-S--></camera>
<fingerPrintModule><!--req, xs: string, fingerprint module type: ALIWARD, HikModule--></fingerPrintModule>
<videoStorageTime><!--req, xs: integer, time for saving video (unit: second), which is between 0 and 10--></
videoStorageTime>
<faceContrastThreshold><!--req, xs: integer, face picture comparison threshold, which is between 0 and 100--></
faceContrastThreshold>
<twoDimensionCode><!--req, xs: string, whether to enable QR code recognition: enable, disable--></
twoDimensionCod>
<blackListCheck><!--req, xs: string, whether to enable blacklist verification: enable, disable--></blackListCheck>
<idCardCheckCenter>
<!--req, xs: string, ID card comparison mode: local-compare with ID card of local storage, server-compare with ID
card of remote server storage-->
</idCardCheckCenter>
<faceAlgorithm>
<!--req, xs: string, face picture algorithm: HIK-Z-Hikviison algorithm, HIK-H-third-party algorithm-->
</faceAlgorithm>
<comNo><!--req, xs: integer, COM No., which is between 1 and 9--></comNo>
<memoryLearning><!--req, xs: string, whether to enable learning and memory function: enable, disable--></
memoryLearning>
<saveCertifiedImage><!--req, xs: string, whether to enable saving authenticated picture: enable, disable--></
saveCertifiedImage>
<MCUVersion><!--opt, xs: string, MCU version information, read-only--></MCUVersion>
<usbOutput><!--opt, xs: string, whether to enable USB output of ID card reader: enable, disable--></usbOutput>
<serialOutput><!--opt, xs: string, whether to enable serial port output of ID card reader: enable, disable--></
serialOutput>
<readInfoOfCard><!--opt, xs: string, set content to be read from CPU card: serialNo-read serial No., file-read file--></
readInfoOfCard>
<workMode><!--opt, xs: string, authentication mode: passMode, accessControlMode--></workMode>
<ecoMode>
<eco><!--opt, xs: string, whether to enable ECO mode: enable, disable--></eco>
<faceMatchThreshold1><!--req, xs: integer, 1V1 face picture comparison threshold of ECO mode, which is between
0 and 100--></faceMatchThreshold1>
<faceMatchThresholdN><!--req, xs: integer, 1:N face picture comparison threshold of ECO mode, which is between
0 and 100--></faceMatchThresholdN>
<changeThreshold><!--opt, xs: string, switching threshold of ECO mode, which is between 0 and 8--></
changeThreshold>
</ecoMode>
<readCardRule><!--opt, xs: string, card No. setting rule: "wiegand26", "wiegand34"--></readCardRule>
</IdentityTerminal>
Intelligent Security API (Access Control on Person) Developer Guide
## 349

6.2.48 XML_M1CardEncryptCfg
M1CardEncryptCfg message in XML format
<M1CardEncryptCfg version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<enable><!--req, xs: boolean, whether to enable--></enable>
<sectionID><!--req, xs:integer, sector ID, only one sector can be configured at a time--></sectionID>
</M1CardEncryptCfg>
6.2.49 XML_ModuleStatus
Message about the status of the secure door control unit in XML format
<ModuleStatus version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<onlineStatus><!--required, xs:string, online status, the value of each bit from the first one indicates the online status
of the secure door control unit with the corresponding door No. For each bit, 0 indicates that the unit is offline, and 1
indicates that the unit is online. The maximum size of this node is 256 bytes--></onlineStatus>
<desmantelStatus><!--required, xs:string, tampering status, the value of each bit from the first one indicates the
tampering status of the secure door control unit with the corresponding door No. For each bit, 0 indicates that the
unit is not tampered, and 1 indicates that the unit is tampered. The maximum size of this node is 256 bytes--></
desmantelStatus>
</ModuleStatus>
6.2.50 XML_ReaderAcrossHost
ReaderAcrossHost message in XML format
<ReaderAcrossHost version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<AcrossHostList size="8">
<AcrossHostAction>
<readerNo><!--req, xs: integer, card reader No., which is between 1 and 8--></readerNo>
<submarineBackEnabled>
<!--req, xs: boolean, whether to enable the cross-controller anti-passing back function of the card reader-->
</submarineBackEnabled>
</AcrossHostAction>
</AcrossHostList>
</ReaderAcrossHost>
6.2.51 XML_ResponseStatus
ResponseStatus message in XML format
<ResponseStatus version="2.0" xmlns="http://www.std-cgi.org/ver20/XMLSchema">
<requestURL>
<!--req, ro, xs:string, request URL-->
</requestURL>
Intelligent Security API (Access Control on Person) Developer Guide
## 350

<statusCode>
<!--req, ro, xs:integer, status code: 0,1-OK, 2-Device Busy, 3-Device Error, 4-Invalid Operation, 5-Invalid XML Format,
6-Invalid XML Content, 7-Reboot Required-->
</statusCode>
<statusString>
<!--req, ro, xs:string, status description: OK, Device Busy, Device Error, Invalid Operation, Invalid XML Format, Invalid
XML Content, Reboot-->
</statusString>
<subStatusCode>
<!--req, ro, xs:string, describe the error reason in detail-->
</subStatusCode>
</ResponseStatus>
## Note
See Error Codes in ResponseStatus for details about sub status codes and corresponding error
codes.
6.2.52 XML_ResponseStatus_AuthenticationFailed
ResponseStatus message in XML format for failed authentication.
<ResponseStatus version="1.0" xmlns="http://www.std-cgi.org/ver20/XMLSchema">
<requestURL><!-- req, ro,xs:string --></requestURL>
<statusCode><!-- req, ro,xs:integer --></statusCode>
<statusString><!-- req, ro,xs:string --></statusString>
<subStatusCode><!-- req, ro,xs:string --></subStatusCode>
<lockStatus><!-- opt, ro,xs:string ,"unlock,locked", locking status--></lockStatus>
<retryTimes><!-- opt, ro,xs:integer, remaining authentication attempts--></retryTimes>
<resLockTime><!-- opt, ro,xs:integer, remaining locking time, unit: second--></resLockTime>
</ResponseStatus>
6.2.53 XML_RemoteControlDoor
RemoteControlDoor message in XML format
<RemoteControlDoor version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
## <cmd>
<!--req, xs:string, command: "open"-open the door, "close"-close the door (controlled), "alwaysOpen"-remain
unlocked (free), "alwaysClose"-remain open (disabled), "visitorCallLadder"-call elevator (visitor),
"householdCallLadder"-call elevator (resident)-->
## </cmd>
## <password>
<!--opt, xs:string, password for opening door. This node is not required for access control devices to remotely
control the door in the LAN. For EZVIZ Cloud Service, this node is required and access control devices will verify the
inputted password-->
## </password>
</RemoteControlDoor>
Intelligent Security API (Access Control on Person) Developer Guide
## 351

6.2.54 XML_ServerDevice
ServerDevice message in XML format
<ServerDevice version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<ipAddr><!--req, xs: string, IP address of the cross-controller anti-passing back server--></ipAddr>
<port><!--req, xs: string, port No. of the cross-controller anti-passing back server--></port>
</ServerDevice>
6.2.55 XML_SnapConfig
SnapConfig message in XML format
<SnapConfig version="2.0"xmlns="http://www.isapi.org/ver20/XMLSchema">
<snapTimes><!--req, xs: integer, capture times triggered by loop, the value is between 0 and 5--></snapTimes>
<snapWaitTime>
<!--req, xs: integer, capture waiting time, the value is betweem 0 and 6,000, currently, this node is reserved-->
</snapWaitTime>
<intervalTimeList><!--req, the list size is 4-->
<intervalTime>
<!--req, xs: integer,
time interval of continuous capture, the value is between 0 and 6,000-->
</intervalTime>
</intervalTimeList>
<JPEGParam>
<pictureSize>
<!--req, xs: string, picture resolution: 0-CIF, 1-QCIF, 2-D1, 3-UXGA (1600 × 1200), 4-SVGA(800 × 600), 5-
HD720p(1280 × 720), 6-VGA, 7-XVGA, 8-HD900p, 9-HD1080, 10-2560 × 1920, 11-1600 × 304，     12-2048 × 1536，
13-2448 × 2048,  14-2448 × 1200， 15-2448 × 800, 16-XGA(1024 × 768), 17-SXGA(1280 × 1024),18-WD1(960 × 576/960
× 480), 19-1080i, 20-576 × 576, 21-1536 × 1536, 22-1920 × 1920, 161-288 × 320, 162-144 × 176, 163-480 × 640,
164-240 × 320, 165-120 × 160, 166-576 × 720, 167-720 × 1280, 168-576 × 960, 180-180*240, 181-360*480,
## 182-540*720, 183-720*960, 184-960*1280, 185-1080*1440, 0xff-auto-->
</pictureSize>
<pictureQuality><!--req, xs: string, picture quality: "best", "better", "general"--></pictureQuality>
</JPEGParam>
</SnapConfig>
6.2.56 XML_StartReaderInfo
StartReaderInfo message in XML format
<StartReaderInfo version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<hostNo><!--req, xs: integer, access controller No., min="1" max="64"--></hostNo>
<readerNo><!--req, xs: integer, card reader No., min="1" max="8"--></readerNo>
</StartReaderInfo>
Intelligent Security API (Access Control on Person) Developer Guide
## 352

6.2.57 XML_SubmarineBack
SubmarineBack message in XML format
<SubmarineBack version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<enabled><!--req, xs: boolean, whether to specify this access controller as the cross-controller anti-passing back
server--></enabled>
</SubmarineBack>
6.2.58 XML_SubmarineBackHostInfo
SubmarineBackHostInfo message in XML format
<SubmarineBackHostInfo version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<HostInfoList size="16">
<Action>
<deviceNo><!--req, xs: integer, device No., which is between 1 and 64--></deviceNo>
<serial><!--req, xs: string,  device serial No., min="9" max="9"--></serial>

</Action>
</HostInfoList>
</SubmarineBackHostInfo>
6.2.59 XML_SubmarineBackMode
SubmarineBackMode message in XML format
<SubmarineBackMode version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
## <mode>
<!--req, xs:string, anti-passing back mode: "disable"-anti-passing back is disabled, "internetCommunicate"-based on
network, "cardReadAndWrite"-based on card-->
## </mode>
## <rule>
<!--req, xs:string, anti-passing back rule: "line"-route anti-passing back, "inOrOut"-entrance/exit anti-passing back.
This node is invalid when the mode is set to "disable"-->
## </rule>
<sectionID>
<!--req, xs:integer, section ID, which is between 1 and 100. This node is valid when mode is "cardReadAndWrite",
and only one section ID can be configured for one configuration-->
</sectionID>
</SubmarineBackMode>
6.2.60 XML_SubmarineBackReader
SubmarineBackReader message in XML format
Intelligent Security API (Access Control on Person) Developer Guide
## 353

<SubmarineBackReader version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<selfHostNo><!--req, xs:integer, access controller No. of the configuration object, which is between 1 and 64--></
selfHostNo>
<selfReaderNo><!--req, xs:integer, card reader No. of the configuration object, which is between 1 and 8--></
selfReaderNo>
<FollowReaderList size="16">
<Action>
<followHostNo><!--req, xs:integer, following access controller No., which is between 1 and 64--></followHostNo>
<followReaderNo><!--req, xs:integer, following card reader No., which is between 1 and 8--></followReaderNo>
</Action>
</FollowReaderList>
</SubmarineBackReader>
6.2.61 XML_WiegandCfg
WiegandCfg message in JSON format
<WiegandCfg version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
<communicateDirection><!--required, xs:string, communication direction: "receive", "send"--></
communicateDirection>
<wiegandMode><!--dependent, xs:string, Wiegand mode: "wiegand26", "wiegand34", "wiegand27", "wiegand35".
This node is valid when <communicateDirection> is "send"--></wiegandMode>
<signalInterval><!--optional, xs:integer, interval of sending Wiegand signals, it is between 1 and 20, unit: ms--></
signalInterval>
<enable><!--optional, xs:boolean, whether to enable Wiegand parameters: true, false--></enable>
</WiegandCfg>
6.2.62 XML_WiegandRuleCfg
WiegandRuleCfg message in XML format
<WiegandRuleCfg version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
## <name>
<!--req, xs:string, Wiegand name-->
## </name>
<CustomerCardIn>
<totalLength>
<!--req, xs:integer, total Wiegand length. When this node is set to 0, the custom Wiegand rule settings will be
cleared-->
</totalLength>
<checkMethod>
<!--req, xs:string, parity mode: "parityCheck,xorCheck,noCheck"-->
</checkMethod>
<ParityCheck>
<!--dep, configuration rule of odd-even parity, this node is valid when <checkMethod> is "parityCheck"-->
<oddBeginBit>
<!--dep, xs:integer, start bit of odd parity-->
</oddBeginBit>
Intelligent Security API (Access Control on Person) Developer Guide
## 354

<oddLength>
<!--dep, xs:integer, odd parity length-->
</oddLength>
<evenBeginBit>
<!--dep, xs:integer, start bit of even parity-->
</evenBeginBit>
<evenLength>
<!--dep, xs:integer, even parity length-->
</evenLength>
</ParityCheck>
<XorCheck>
<!--dep, configuration rule of XOR parity, this node is valid when <checkMethod> is "xorCheck"-->
<xorBeginBit>
<!--dep, xs:integer, start bit of XOR parity-->
</xorBeginBit>
<xorPerLength>
<!--dep, xs:integer, length of each XOR parity group-->
</xorPerLength>
<xorTotalLength>
<!--dep, xs:integer, total length of XOR parity data-->
</xorTotalLength>
</XorCheck>
<cardIdBeginBit>
<!--req, xs:integer, start bit of the card No.-->
</cardIdBeginBit>
<cardIdLength>
<!--req, xs:integer, card No. length-->
</cardIdLength>
<siteCodeBeginBit>
<!--req, xs:integer, start bit of the site code-->
</siteCodeBeginBit>
<siteCodeLength>
<!--req, xs:integer, site code length-->
</siteCodeLength>
<oemBeginBit>
<!--req, xs:integer, start bit of OEM-->
</oemBeginBit>
<oemLength>
<!--req, xs:integer, OEM length-->
</oemLength>
<manufacturerCodeBeginBit>
<!--req, xs:integer, start bit of the manufacturer code-->
</manufacturerCodeBeginBit>
<manufacturerCodeLength>
<!--req, xs:integer, manufacturer code length-->
</manufacturerCodeLength>
</CustomerCardIn>
<CustomerCardOut>
<CardContentList size="4">
<!--This node contains multiple <Action> nodes, and the <type> node in each <Action> node can only be set to
one type. The order of the types will determine the combination order of the rules-->
<Action>
Intelligent Security API (Access Control on Person) Developer Guide
## 355

<No>
<!--req, xs:integer, No.-->
</No>
## <type>
<!--req, xs:string, type: "cardId"-card ID, "siteCode"-site code, "oem"-OEM No., "manufacturerCode"-
manufacturer code-->
## </type>
## <length>
<!--req, xs:integer, length of the corresponding decimal data-->
## </length>
</Action>
</CardContentList>
</CustomerCardOut>
</WiegandRuleCfg>
Intelligent Security API (Access Control on Person) Developer Guide
## 356

## Appendix A. Appendixes
## A.1 Access Control Event Types
The access control events are classified as four major types, i.e., alarm events
(MAJOR_ALARM-0x1), exception events (MAJOR_EXCEPTION-0x2), operation events
(MAJOR_OPERATION-0x3), and other events (MAJOR_EVENT-0x5). Each major type corresponds to
multiple minor types, see details below.
## MAJOR_ALARM
Event Minor TypeValueDescription
## MINOR_ALARMIN_SHORT_
## CIRCUIT
0x400Zone Short Circuit Attempts
## Alarm
## MINOR_ALARMIN_BROKEN_
## CIRCUIT
0x401Zone Disconnected Alarm
MINOR_ALARMIN_EXCEPTION0x402Zone Exception Alarm
MINOR_ALARMIN_RESUME0x403Zone Restored
## MINOR_HOST_DESMANTLE_
## ALARM
0x404Zone Tampering Alarm
## MINOR_HOST_DESMANTLE_
## RESUME
0x405Zone Tampering Restored
## MINOR_CARD_READER_
## DESMANTLE_ALARM
0x406Card Reader Tampering Alarm
## MINOR_CARD_READER_
## DESMANTLE_RESUME
0x407Card Reader Tampering
## Restored
MINOR_CASE_SENSOR_ALARM0x408Alarm Input Alarm Triggered
## MINOR_CASE_SENSOR_
## RESUME
0x409Alarm Input Restored
MINOR_STRESS_ALARM0x40aDuress Alarm
## MINOR_OFFLINE_ECENT_
## NEARLY_FULL
0x40bNo Memory for Offline Event
## Storage Alarm
## MINOR_CARD_MAX_
## AUTHENTICATE_FAIL
0x40cMaximum Failed Card
## Authentications Alarm
MINOR_SD_CARD_FULL0x40dSD Card Full Alarm
Intelligent Security API (Access Control on Person) Developer Guide
## 357

Event Minor TypeValueDescription
## MINOR_LINKAGE_CAPTURE_
## PIC
0x40eCapture Linkage Alarm
## MINOR_SECURITY_MODULE_
## DESMANTLE_ALARM
0x40fSecure Door Control Unit
## Tampering Alarm
## MINOR_SECURITY_MODULE_
## DESMANTLE_RESUME
0x410Secure Door Control Unit
## Tampering Restored
## MINOR_FIRE_IMPORT_SHORT_
## CIRCUIT
0x415Fire Input Short Circuit
## Attempts Alarm
## MINOR_FIRE_IMPORT_
## BROKEN_CIRCUIT
0x416Fire Input Open Circuit
## Attempts Alarm
## MINOR_FIRE_IMPORT_
## RESUME
0x417Fire Input Restored
## MINOR_FIRE_BUTTON_
## TRIGGER
0x418Fire Button Triggered
## MINOR_FIRE_BUTTON_
## RESUME
0x419Fire Button Resumed
## MINOR_MAINTENANCE_
## BUTTON_TRIGGER
0x41aMaintenance Button Triggered
## MINOR_MAINTENANCE_
## BUTTON_RESUME
0x41bMaintenance Button Resumed
## MINOR_EMERGENCY_
## BUTTON_TRIGGER
0x41cPanic Button Triggered
## MINOR_EMERGENCY_
## BUTTON_RESUME
0x41dPanic Button Resumed
## MINOR_DISTRACT_
## CONTROLLER_ALARM
0x41eDistributed Elevator Controller
## Tampering Alarm
## MINOR_DISTRACT_
## CONTROLLER_RESUME
0x41fDistributed Elevator Controller
## Tampering Restored
## MINOR_CHANNEL_
## CONTROLLER_DESMANTLE_
## ALARM
0x422Lane Controller Tampering
## Alarm
## MINOR_CHANNEL_
## CONTROLLER_DESMANTLE_
## RESUME
0x423Lane Controller Tampering
## Alarm Restored
Intelligent Security API (Access Control on Person) Developer Guide
## 358

Event Minor TypeValueDescription
## MINOR_CHANNEL_
## CONTROLLER_FIRE_IMPORT_
## ALARM
0x424Lane Controller Fire Input
## Alarm
## MINOR_CHANNEL_
## CONTROLLER_FIRE_IMPORT_
## RESUME
0x425Lane Controller Fire Input
## Alarm Restored
## MINOR_PRINTER_OUT_OF_
## PAPER
0x440No Paper in Printer Alarm
## MINOR_LEGAL_EVENT_
## NEARLY_FULL
0x442No Memory Alarm for Valid
## Offline Event Storage
MINOR_ALARM_CUSTOM1 to
## MINOR_ALARM_CUSTOM64
0x900 to 0x93fAccess Control: Custom Alarm
Event 1 to Custom Alarm Event
## 64
## MAJOR_EXCEPTION
Event Minor TypeValueDescription
MINOR_NET_BROKEN0x27Network Disconnected
## MINOR_RS485_DEVICE_
## ABNORMAL
0x3aRS485 Connection Exception
## MINOR_RS485_DEVICE_
## REVERT
0x3bRS485 Connection Restored
MINOR_DEV_POWER_ON0x400Power on
MINOR_DEV_POWER_OFF0x401Power off
MINOR_WATCH_DOG_RESET0x402Watchdog Reset
MINOR_LOW_BATTERY0x403Low Battery Voltage
MINOR_BATTERY_RESUME0x404Battery Voltage Restored
MINOR_AC_OFF0x405AC Power Disconnected
MINOR_AC_RESUME0x406AC Power Restored
MINOR_NET_RESUME0x407Network Restored
MINOR_FLASH_ABNORMAL0x408Flash Reading and Writing
## Exception
## MINOR_CARD_READER_
## OFFLINE
0x409Card Reader Offline
Intelligent Security API (Access Control on Person) Developer Guide
## 359

Event Minor TypeValueDescription
## MINOR_CAED_READER_
## RESUME
0x40aCard Reader Online
## MINOR_INDICATOR_LIGHT_
## OFF
0x40bIndicator Turns off
## MINOR_INDICATOR_LIGHT_
## RESUME
0x40cIndicator Resumed
## MINOR_CHANNEL_
## CONTROLLER_OFF
0x40dLane Controller Offline
## MINOR_CHANNEL_
## CONTROLLER_RESUME
0x40eLane Controller Online
## MINOR_SECURITY_MODULE_
## OFF
0x40fSecure Door Control Unit
## Offline
## MINOR_SECURITY_MODULE_
## RESUME
0x410Secure Door Control Unit
## Online
## MINOR_BATTERY_ELECTRIC_
## LOW
0x411Low Battery Voltage (Only for
## Face Recognition Terminal)
## MINOR_BATTERY_ELECTRIC_
## RESUME
0x412Battery Voltage Recovered
(Only for Face Recognition
## Terminal)
## MINOR_LOCAL_CONTROL_
## NET_BROKEN
0x413Network of Distributed Access
## Controller Disconnected
## MINOR_LOCAL_CONTROL_
## NET_RSUME
0x414Network of Distributed Access
## Controller Restored
## MINOR_MASTER_RS485_
## LOOPNODE_BROKEN
0x415RS485 Loop of Master Access
## Controller Disconnected
## MINOR_MASTER_RS485_
## LOOPNODE_RESUME
0x416RS485 Loop of Master Access
## Controller Connected
## MINOR_LOCAL_CONTROL_
## OFFLINE
0x417Distributed Access Controller
## Offline
## MINOR_LOCAL_CONTROL_
## RESUME
0x418Distributed Access Controller
## Online
## MINOR_LOCAL_DOWNSIDE_
## RS485_LOOPNODE_BROKEN
0x419Downstream RS485 Loop of
## Distributed Access Control
## Disconnected
Intelligent Security API (Access Control on Person) Developer Guide
## 360

Event Minor TypeValueDescription
## MINOR_LOCAL_DOWNSIDE_
## RS485_LOOPNODE_RESUME
0x41aDownstream RS485 Loop of
## Distributed Access Control
## Connected
## MINOR_DISTRACT_
## CONTROLLER_ONLINE
0x41bDistributed Elevator Controller
## Online
## MINOR_DISTRACT_
## CONTROLLER_OFFLINE
0x41cDistributed Elevator Controller
## Offline
## MINOR_ID_CARD_READER_
## NOT_CONNECT
0x41dID Card Reader Disconnected
## MINOR_ID_CARD_READER_
## RESUME
0x41eID Card Reader Connected
## MINOR_FINGER_PRINT_
## MODULE_NOT_CONNECT
0x41fFingerprint Module
## Disconnected
## MINOR_FINGER_PRINT_
## MODULE_RESUME
0x420Fingerprint Module Connected
## MINOR_CAMERA_NOT_
## CONNECT
0x421Camera Disconnected
MINOR_CAMERA_RESUME0x422Camera Connected
MINOR_COM_NOT_CONNECT0x423COM Port Disconnected
MINOR_COM_RESUME0x424COM Port Connected
## MINOR_DEVICE_NOT_
## AUTHORIZE
0x425Device Unauthorized
## MINOR_PEOPLE_AND_ID_
## CARD_DEVICE_ONLINE
0x426Face Recognition Terminal
## Online
## MINOR_PEOPLE_AND_ID_
## CARD_DEVICE_OFFLINE
0x427Face Recognition Terminal
## Offline
MINOR_LOCAL_LOGIN_LOCK0x428Local Login Lock
## MINOR_LOCAL_LOGIN_
## UNLOCK
0x429Local Login Unlock
## MINOR_SUBMARINEBACK_
## COMM_BREAK
0x42aCommunication with Anti-
passing Back Server Failed
## MINOR_SUBMARINEBACK_
## COMM_RESUME
0x42bCommunication with Anti-
passing Back Server Restored
Intelligent Security API (Access Control on Person) Developer Guide
## 361

Event Minor TypeValueDescription
## MINOR_MOTOR_SENSOR_
## EXCEPTION
0x42cMotor or Sensor Exception
MINOR_CAN_BUS_EXCEPTION0x42dCAN Bus Exception
MINOR_CAN_BUS_RESUME0x42eCAN Bus Exception Restored
## MINOR_GATE_TEMPERATURE_
## OVERRUN
0x42fToo High Pedestal Temperature
## MINOR_IR_EMITTER_
## EXCEPTION
0x430Active Infrared Intrusion
## Detector Exception
MINOR_IR_EMITTER_RESUME0x431Active Infrared Intrusion
## Detector Restored
## MINOR_LAMP_BOARD_
## COMM_EXCEPTION
0x432Communication with Light
## Board Failed
## MINOR_LAMP_BOARD_
## COMM_RESUME
0x433Communication with Light
## Board Restored
## MINOR_IR_ADAPTOR_COMM_
## EXCEPTION
0x434Communication with IR
## Adaptor Failed
## MINOR_IR_ADAPTOR_COMM_
## RESUME
0x435Communication with IR
## Adaptor Restored
MINOR_PRINTER_ONLINE0x436Printer Online
MINOR_PRINTER_OFFLINE0x437Printer Offline
MINOR_4G_MOUDLE_ONLINE0x4384G Module Online
MINOR_4G_MOUDLE_OFFLINE0x4394G Module Offline
## MINOR_AUXILIARY_BOARD_
## OFFLINE
0x43cAuxiliary Board Disconnected
## MINOR_AUXILIARY_BOARD_
## RESUME
0x43dAuxiliary Board Connected
## MINOR_IDCARD_SECURITY_
## MOUDLE_EXCEPTION
0x43eSecure ID Card Unit Exception
## MINOR_IDCARD_SECURITY_
## MOUDLE_RESUME
0x43fSecure ID Card Unit Restored
## MINOR_FP_PERIPHERAL_
## EXCEPTION
0x440Fingerprint Collection
## Peripheral Exception
Intelligent Security API (Access Control on Person) Developer Guide
## 362

Event Minor TypeValueDescription
## MINOR_FP_PERIPHERAL_
## RESUME
0x441Fingerprint Collection
## Peripheral Restored
## MINOR_EXCEPTION_CUSTOM1
to MINOR_EXCEPTION_
## CUSTOM64
0x900 to 0x93fAccess Control: Custom
Exception Event 1 to Custom
## Exception Event 64
## MAJOR_OPERATION
Alarm Minor TypesValueDescription
MINOR_LOCAL_LOGIN0x50Local Login
MINOR_LOCAL_LOGOUT0x51Local Logout
MINOR_LOCAL_UPGRADE0x5aLocal Upgrade
MINOR_REMOTE_LOGIN0x70Remote Login
MINOR_REMOTE_LOGOUT0x71Remote Logout
MINOR_REMOTE_ARM0x79Remote Arming
MINOR_REMOTE_DISARM0x7aRemote Disarming
MINOR_REMOTE_REBOOT0x7bRemote Reboot
MINOR_REMOTE_UPGRADE0x7eRemote Upgrade
## MINOR_REMOTE_CFGFILE_
## OUTPUT
0x86Remote Operation: Export
## Configuration File
## MINOR_REMOTE_CFGFILE_
## INTPUT
0x87Remote Operation: Import
## Configuration File
## MINOR_REMOTE_ALARMOUT_
## OPEN_MAN
0xd6Remote Operation: Enable
## Alarm Output Manually
## MINOR_REMOTE_ALARMOUT_
## CLOSE_MAN
0xd7Remote Operation: Disable
## Alarm Output Manually
MINOR_REMOTE_OPEN_DOOR0x400Door Remotely Open
## MINOR_REMOTE_CLOSE_
## DOOR
0x401Door Remotely Closed
## MINOR_REMOTE_ALWAYS_
## OPEN
0x402Remain Open Remotely
## MINOR_REMOTE_ALWAYS_
## CLOSE
0x403Remain Closed Remotely
Intelligent Security API (Access Control on Person) Developer Guide
## 363

Alarm Minor TypesValueDescription
MINOR_REMOTE_CHECK_TIME0x404Remote: Manual Time Sync
MINOR_NTP_CHECK_TIME0x405Network Time Protocol
## Synchronization
MINOR_REMOTE_CLEAR_CARD0x406Remote Operation: Clear All
## Card No.
## MINOR_REMOTE_RESTORE_
## CFG
0x407Remote Operation: Restore
## Defaults
MINOR_ALARMIN_ARM0x408Zone Arming
MINOR_ALARMIN_DISARM0x409Zone Disarming
MINOR_LOCAL_RESTORE_CFG0x40aLocal Operation: Restore
## Defaults
## MINOR_REMOTE_CAPTURE_
## PIC
0x40bRemote Operation: Capture
## MINOR_MOD_NET_REPORT_
## CFG
0x40cEdit Network Parameters
## MINOR_MOD_GPRS_REPORT_
## PARAM
0x40dEdit GPRS Parameters
## MINOR_MOD_REPORT_
## GROUP_PARAM
0x40eEdit Control Center Parameters
## MINOR_UNLOCK_PASSWORD_
## OPEN_DOOR
0x40fEnter Dismiss Code
MINOR_AUTO_RENUMBER0x410Auto Renumber
## MINOR_AUTO_COMPLEMENT_
## NUMBER
0x411Auto Supplement Number
## MINOR_NORMAL_CFGFILE_
## INPUT
0x412Import Configuration File
## MINOR_NORMAL_CFGFILE_
## OUTTPUT
0x413Export Configuration File
MINOR_CARD_RIGHT_INPUT0x414Import Card Permission
## Parameters
## MINOR_CARD_RIGHT_
## OUTTPUT
0x415Export Card Permission
## Parameters
Intelligent Security API (Access Control on Person) Developer Guide
## 364

Alarm Minor TypesValueDescription
MINOR_LOCAL_USB_UPGRADE0x416Upgrade Device via USB flash
## Drive
## MINOR_REMOTE_VISITOR_
## CALL_LADDER
0x417Visitor Calling Elevator
## MINOR_REMOTE_
## HOUSEHOLD_CALL_LADDER
0x418Resident Calling Elevator
## MINOR_REMOTE_ACTUAL_
## GUARD
0x419Remotely Arming
## MINOR_REMOTE_ACTUAL_
## UNGUARD
0x41aRemotely Disarming
## MINOR_REMOTE_CONTROL_
## NOT_CODE_OPER_FAILED
0x41bOperation Failed: Keyfob Not
## Pairing
## MINOR_REMOTE_CONTROL_
## CLOSE_DOOR
0x41cKeyfob Operation: Close Door
## MINOR_REMOTE_CONTROL_
## OPEN_DOOR
0x41dKeyfob Operation: Open Door
## MINOR_REMOTE_CONTROL_
## ALWAYS_OPEN_DOOR
0x41eKeyfob Operation: Remain
## Door Open
## MINOR_M1_CARD_ENCRYPT_
## VERIFY_OPEN
0x41fM1 Card Encryption
## Verification Enabled
## MINOR_M1_CARD_ENCRYPT_
## VERIFY_CLOSE
0x420M1 Card Encryption
## Verification Disabled
MINOR_NFC_FUNCTION_OPEN0X421Opening Door with NFC Card
## Enabled
## MINOR_NFC_FUNCTION_
## CLOSE
0X422Opening Door with NFC Card
## Disabled
## MINOR_OFFLINE_DATA_
## OUTPUT
0x423Export Offline Collected Data
MINOR_CREATE_SSH_LINK0x42dEstablish SSH Connection
MINOR_CLOSE_SSH_LINK0x42eDisconnect SSH Connection
## MINOR_OPERATION_CUSTOM1
to MINOR_OPERATION_
## CUSTOM64
0x900-0x93fAccess Control: Custom
Operation Event 1 to Custom
## Operation Event 64
Intelligent Security API (Access Control on Person) Developer Guide
## 365

## MAJOR_EVENT
Event Minor TypesValueDescription
MINOR_LEGAL_CARD_PASS0x01Valid Card Authentication
## Completed
MINOR_CARD_AND_PSW_PASS0x02Card and Password
## Authentication Completed
MINOR_CARD_AND_PSW_FAIL0x03Card and Password
## Authentication Failed
## MINOR_CARD_AND_PSW_
## TIMEOUT
0x04Card and Password
## Authentication Timed Out
## MINOR_CARD_AND_PSW_
## OVER_TIME
0x05Card and Password
## Authentication Timed Out
MINOR_CARD_NO_RIGHT0x06No Permission
## MINOR_CARD_INVALID_
## PERIOD
0x07Invalid Card Swiping Time
## Period
MINOR_CARD_OUT_OF_DATE0x08Expired Card
MINOR_INVALID_CARD0x09Card No. Not Exist
MINOR_ANTI_SNEAK_FAIL0x0aAnti-​passing Back
## Authentication Failed
## MINOR_INTERLOCK_DOOR_
## NOT_CLOSE
0x0bInterlocking Door Not Closed
## MINOR_NOT_BELONG_MULTI_
## GROUP
0x0cCard Not in Multiple
## Authentication Group
## MINOR_INVALID_MULTI_
## VERIFY_PERIOD
0x0dCard Not in Multiple
## Authentication Duration
## MINOR_MULTI_VERIFY_
## SUPER_RIGHT_FAIL
0x0eMultiple Authentications:
## Super Password Authentication
## Failed
## MINOR_MULTI_VERIFY_
## REMOTE_RIGHT_FAIL
0x0fMultiple Authentication
## Completed
## MINOR_MULTI_VERIFY_
## SUCCESS
0x10Multiple Authenticated
## MINOR_LEADER_CARD_OPEN_
## BEGIN
0x11Open Door with First Card
## Started
Intelligent Security API (Access Control on Person) Developer Guide
## 366

Event Minor TypesValueDescription
## MINOR_LEADER_CARD_OPEN_
## END
0x12Open Door with First Card
## Stopped
MINOR_ALWAYS_OPEN_BEGIN0x13Remain Open Started
MINOR_ALWAYS_OPEN_END0x14Remain Open Stopped
MINOR_LOCK_OPEN0x15Door Unlocked
MINOR_LOCK_CLOSE0x16Door Locked
MINOR_DOOR_BUTTON_PRESS0x17Exit Button Pressed
## MINOR_DOOR_BUTTON_
## RELEASE
0x18Exit Button Released
## MINOR_DOOR_OPEN_
## NORMAL
0x19Door Open (Contact)
## MINOR_DOOR_CLOSE_
## NORMAL
0x1aDoor Closed (Contact)
## MINOR_DOOR_OPEN_
## ABNORMAL
0x1bDoor Abnormally Open
(Contact)
## MINOR_DOOR_OPEN_
## TIMEOUT
0x1cDoor Open Timed Out
(Contact)
MINOR_ALARMOUT_ON0x1dAlarm Output Enabled
MINOR_ALARMOUT_OFF0x1eAlarm Output Disabled
MINOR_ALWAYS_CLOSE_BEGIN0x1fRemain Closed Started
MINOR_ALWAYS_CLOSE_END0x20Remain Closed Stopped
## MINOR_MULTI_VERIFY_NEED_
## REMOTE_OPEN
0x21Multiple Authentications:
## Remotely Open Door
## MINOR_MULTI_VERIFY_
## SUPERPASSWD_VERIFY_
## SUCCESS
0x22Multiple Authentications:
## Super Password Authentication
## Completed
## MINOR_MULTI_VERIFY_
## REPEAT_VERIFY
0x23Multiple Authentications:
## Repeated Authentication
## MINOR_MULTI_VERIFY_
## TIMEOUT
0x24Multiple Authentications Timed
## Out
MINOR_DOORBELL_RINGING0x25Doorbell Ring
Intelligent Security API (Access Control on Person) Developer Guide
## 367

Event Minor TypesValueDescription
## MINOR_FINGERPRINT_
## COMPARE_PASS
0x26Fingerprint Matched
## MINOR_FINGERPRINT_
## COMPARE_FAIL
0x27Fingerprint Mismatched
## MINOR_CARD_FINGERPRINT_
## VERIFY_PASS
0x28Card and Fingerprint
## Authentication Completed
## MINOR_CARD_FINGERPRINT_
## VERIFY_FAIL
0x29Card and Fingerprint
## Authentication Failed
## MINOR_CARD_FINGERPRINT_
## VERIFY_TIMEOUT
0x2aCard and Fingerprint
## Authentication Timed Out
## MINOR_CARD_FINGERPRINT_
## PASSWD_VERIFY_PASS
0x2bCard and Fingerprint and
## Password Authentication
## Completed
## MINOR_CARD_FINGERPRINT_
## PASSWD_VERIFY_FAIL
0x2cCard and Fingerprint and
## Password Authentication Failed
## MINOR_CARD_FINGERPRINT_
## PASSWD_VERIFY_TIMEOUT
0x2dCard and Fingerprint and
## Password Authentication
## Timed Out
## MINOR_FINGERPRINT_
## PASSWD_VERIFY_PASS
0x2eFingerprint and Password
## Authentication Completed
## MINOR_FINGERPRINT_
## PASSWD_VERIFY_FAIL
0x2fFingerprint and Password
## Authentication Failed
## MINOR_FINGERPRINT_
## PASSWD_VERIFY_TIMEOUT
0x30Fingerprint and Password
## Authentication Timed Out
## MINOR_FINGERPRINT_
## INEXISTENCE
0x31Fingerprint Not Exists
## MINOR_CARD_PLATFORM_
## VERIFY
0x32Card Platform Authentication
MINOR_CALL_CENTER0x33Call Center
## MINOR_FIRE_RELAY_TURN_
## ON_DOOR_ALWAYS_OPEN
0x34Fire Relay Closed: Door
## Remains Open
## MINOR_FIRE_RELAY_
## RECOVER_DOOR_RECOVER_
## NORMAL
0x35Fire Relay Opened: Door
## Remains Closed
Intelligent Security API (Access Control on Person) Developer Guide
## 368

Event Minor TypesValueDescription
## MINOR_EMPLOYEENO_AND_
## FP_VERIFY_PASS
0x45Employee ID and Fingerprint
## Authentication Completed
## MINOR_EMPLOYEENO_AND_
## FP_VERIFY_FAIL
0x46Employee ID and Fingerprint
## Authentication Failed
## MINOR_EMPLOYEENO_AND_
## FP_VERIFY_TIMEOUT
0x47Employee ID and Fingerprint
## Authentication Timed Out
## MINOR_EMPLOYEENO_AND_
## FP_AND_PW_VERIFY_PASS
0x48Employee ID and Fingerprint
and Password Authentication
## Completed
## MINOR_EMPLOYEENO_AND_
## FP_AND_PW_VERIFY_FAIL
0x49Employee ID and Fingerprint
and Password Authentication
## Failed
## MINOR_EMPLOYEENO_AND_
## FP_AND_PW_VERIFY_
## TIMEOUT
0x4aEmployee ID and Fingerprint
and Password Authentication
## Timed Out
MINOR_FACE_VERIFY_PASS0x4bFace Authentication Completed
MINOR_FACE_VERIFY_FAIL0x4cFace Authentication Failed
## MINOR_EMPLOYEENO_AND_
## FACE_VERIFY_PASS
0x4dEmployee ID and Face
## Authentication Completed
## MINOR_EMPLOYEENO_AND_
## FACE_VERIFY_FAIL
0x4eEmployee ID and Face
## Authentication Failed
## MINOR_EMPLOYEENO_AND_
## FACE_VERIFY_TIMEOUT
0x4fEmployee ID and Face
## Authentication Timed Out
MINOR_FACE_RECOGNIZE_FAIL0x50Face Recognition Failed
## MINOR_FIRSTCARD_
## AUTHORIZE_BEGIN
0x51First Card Authorization Started
## MINOR_FIRSTCARD_
## AUTHORIZE_END
0x52First Card Authorization Ended
## MINOR_DOORLOCK_INPUT_
## SHORT_CIRCUIT
0x53Lock Input Short Circuit
## Attempts Alarm
## MINOR_DOORLOCK_INPUT_
## BROKEN_CIRCUIT
0x54Lock Input Open Circuit
## Attempts Alarm
## MINOR_DOORLOCK_INPUT_
## EXCEPTION
0x55Lock Input Exception Alarm
Intelligent Security API (Access Control on Person) Developer Guide
## 369

Event Minor TypesValueDescription
## MINOR_DOORCONTACT_
## INPUT_SHORT_CIRCUIT
0x56Contact Input Short Circuit
## Attempts Alarm
## MINOR_DOORCONTACT_
## INPUT_BROKEN_CIRCUIT
0x57Contact Input Open Circuit
## Attempts Alarm
## MINOR_DOORCONTACT_
## INPUT_EXCEPTION
0x58Contact Input Exception Alarm
## MINOR_OPENBUTTON_INPUT_
## SHORT_CIRCUIT
0x59Exit Button Input Short Circuit
## Attempts Alarm
## MINOR_OPENBUTTON_INPUT_
## BROKEN_CIRCUIT
0x5aExit Button Input Open Circuit
## Attempts Alarm
## MINOR_OPENBUTTON_INPUT_
## EXCEPTION
0x5bExit Button Input Exception
## Alarm
## MINOR_DOORLOCK_OPEN_
## EXCEPTION
0x5cUnlocking Exception
## MINOR_DOORLOCK_OPEN_
## TIMEOUT
0x5dUnlocking Timed Out
## MINOR_FIRSTCARD_OPEN_
## WITHOUT_AUTHORIZE
0x5eUnauthorized First Card
## Opening Failed
## MINOR_CALL_LADDER_RELAY_
## BREAK
0x5fCall Elevator Relay Open
## MINOR_CALL_LADDER_RELAY_
## CLOSE
0x60Call Elevator Relay Closed
## MINOR_AUTO_KEY_RELAY_
## BREAK
0x61Auto Button Relay Open
## MINOR_AUTO_KEY_RELAY_
## CLOSE
0x62Auto Button Relay Closed
## MINOR_KEY_CONTROL_RELAY_
## BREAK
0x63Button Relay Open
## MINOR_KEY_CONTROL_RELAY_
## CLOSE
0x64Button Relay Closed
## MINOR_EMPLOYEENO_AND_
## PW_PASS
0x65Employee ID and Password
## Authentication Completed
## MINOR_EMPLOYEENO_AND_
## PW_FAIL
0x66Employee ID and Password
## Authentication Failed
Intelligent Security API (Access Control on Person) Developer Guide
## 370

Event Minor TypesValueDescription
## MINOR_EMPLOYEENO_AND_
## PW_TIMEOUT
0x67Employee ID and Password
## Authentication Timed Out
## MINOR_CERTIFICATE_BLACK_
## LIST
0x71Blacklist Event
MINOR_LEGAL_MESSAGE0x72Valid Message
MINOR_ILLEGAL_MESSAGE0x73Invalid Message
## MINOR_DOOR_OPEN_OR_
## DORMANT_FAIL
0x75Authentication Failed: Door
Remain Closed or Door in
## Sleeping Mode
## MINOR_AUTH_PLAN_
## DORMANT_FAIL
0x76Authentication Failed:
Authentication Schedule in
## Sleeping Mode
## MINOR_CARD_ENCRYPT_
## VERIFY_FAIL
0x77Card Encryption Verification
## Failed
## MINOR_SUBMARINEBACK_
## REPLY_FAIL
0x78Anti-​passing Back Server
## Response Failed
## MINOR_DOOR_OPEN_OR_
## DORMANT_OPEN_FAIL
0x82Open Door via Exit Button
## Failed When Door Remain
Closed or in Sleeping Mode
## MINOR_DOOR_OPEN_OR_
## DORMANT_LINKAGE_OPEN_
## FAIL
0x84Door Linkage Open Failed
During Door Remain Close or
## Sleeping
MINOR_TRAILING0x85Tailgating
MINOR_REVERSE_ACCESS0x86Reverse Passing
MINOR_FORCE_ACCESS0x87Force Accessing
## MINOR_CLIMBING_OVER_
## GATE
0x88Climb Over
MINOR_PASSING_TIMEOUT0x89Passing Timed Out
MINOR_INTRUSION_ALARM0x8aIntrusion Alarm
## MINOR_FREE_GATE_PASS_
## NOT_AUTH
0x8bAuthentication Failed When
## Free Passing
MINOR_DROP_ARM_BLOCK0x8cBarrier Obstructed
Intelligent Security API (Access Control on Person) Developer Guide
## 371

Event Minor TypesValueDescription
## MINOR_DROP_ARM_BLOCK_
## RESUME
0x8dBarrier Restored
## MINOR_PASSWORD_
## MISMATCH
0x97Passwords Mismatched
## MINOR_EMPLOYEE_NO_NOT_
## EXIST
0x98Employee ID Not Exists
## MINOR_COMBINED_VERIFY_
## PASS
0x99Combined Authentication
## Completed
## MINOR_COMBINED_VERIFY_
## TIMEOUT
0x9aCombined Authentication
## Timed Out
## MINOR_VERIFY_MODE_
## MISMATCH
0x9bAuthentication Type
## Mismatched
## MINOR_INFORMAL_MIFARE_
## CARD_VERIFY_FAIL
0xa2Authentication Failed: Invalid
## Mifare Card
## MINOR_CPU_CARD_ENCRYPT_
## VERIFY_FAIL
0xa3Verifying CPU Card Encryption
## Failed
## MINOR_NFC_DISABLE_VERIFY_
## FAIL
0xa4Disabling NFC Verification
## Failed
## MINOR_EM_CARD_
## RECOGNIZE_NOT_ENABLED
0xa8EM Card Recognition Disabled
## MINOR_M1_CARD_
## RECOGNIZE_NOT_ENABLED
0xa9M1 Card Recognition Disabled
## MINOR_CPU_CARD_
## RECOGNIZE_NOT_ENABLED
0xaaCPU Card Recognition Disabled
## MINOR_ID_CARD_RECOGNIZE_
## NOT_ENABLED
0xabID Card Recognition Disabled
## MINOR_CARD_SET_SECRET_
## KEY_FAIL
0xacImporting Key to Card Failed
MINOR_LOCAL_UPGRADE_FAIL0xadLocal Upgrade Failed
## MINOR_REMOTE_UPGRADE_
## FAIL
0xaeRemote Upgrade Failed
## MINOR_REMOTE_EXTEND_
## MODULE_UPGRADE_SUCC
0xafExtension Module is Remotely
## Upgraded
Intelligent Security API (Access Control on Person) Developer Guide
## 372

Event Minor TypesValueDescription
## MINOR_REMOTE_EXTEND_
## MODULE_UPGRADE_FAIL
0xb0Upgrading Extension Module
## Remotely Failed
## MINOR_REMOTE_FINGER_
## PRINT_MODULE_UPGRADE_
## SUCC
0xb1Fingerprint Module is Remotely
## Upgraded
## MINOR_REMOTE_FINGER_
## PRINT_MODULE_UPGRADE_
## FAIL
0xb2Upgrading Fingerprint Module
## Remotely Failed
## MINOR_DYNAMICCODE_
## VERIFY_PASS
0xb3Dynamic Verification Code
## Authenticated
## MINOR_DYNAMICCODE_
## VERIFY_FAIL
0xb4Authentication with
## Verification Code Failed
MINOR_PASSWD_VERIFY_PASS0xb5Password Authenticated
MINOR_EVENT_CUSTOM1 to
## MINOR_EVENT_CUSTOM64
0x500 to 0x53fAccess Control: Custom Event 1
to Custom Event 64
## A.2 Event Linkage Types
For event card linkages, if the linkage type is event, four major event linkage types are available: 0-
device event linkage, 1-alarm input event linkage, 2-access control point (e.g., doors, elevators,
etc.) event linkage, and
3-authentication unit (e.g., card reader, fingerprint module, etc.) event
linkage. Each major event linkage type corresponds
multiple minor types of event linkage, see
details in the following content.
## Device Event Linkage
Minor TypeValueDescription
## EVENT_ACS_HOST_ANTI_
## DISMANTLE
0Access Controller Tampering Alarm
## EVENT_ACS_OFFLINE_ECENT_
## NEARLY_FULL
1No Memory Alarm
EVENT_ACS_NET_BROKEN2Network Disconnected
EVENT_ACS_NET_RESUME3Network Connected
EVENT_ACS_LOW_BATTERY4Low Battery Voltage
EVENT_ACS_BATTERY_RESUME5Battery Fully Charged
Intelligent Security API (Access Control on Person) Developer Guide
## 373

Minor TypeValueDescription
EVENT_ACS_AC_OFF6AC Power Off
EVENT_ACS_AC_RESUME7AC Power On
EVENT_ACS_SD_CARD_FULL8SD Card Full Alarm
## EVENT_ACS_LINKAGE_
## CAPTURE_PIC
9Capture Linkage Event Alarm
## EVENT_ACS_IMAGE_QUALITY_
## LOW
10Low Face Picture Quality
## EVENT_ACS_FINGER_PRINT_
## QUALITY_LOW
11Low Fingerprint Picture Quality
## EVENT_ACS_BATTERY_
## ELECTRIC_LOW
12Low Battery Voltage
## EVENT_ACS_BATTERY_
## ELECTRIC_RESUME
13Battery Fully Charged
## EVENT_ACS_FIRE_IMPORT_
## SHORT_CIRCUIT
14Fire Input Short Circuit Attempts Alarm
## EVENT_ACS_FIRE_IMPORT_
## BROKEN_CIRCUIT
15Fire Input Open Circuit Attempts Alarm
## EVENT_ACS_FIRE_IMPORT_
## RESUME
16Fire Input Alarm Restored
## EVENT_ACS_MASTER_RS485_
## LOOPNODE_BROKEN
17RS485 Loop of Master Access Controller
## Disconnected
## EVENT_ACS_MASTER_RS485_
## LOOPNODE_RESUME
18RS485 Loop of Master Access Controller
## Connected
## EVENT_ACS_LOCAL_CONTROL_
## OFFLINE
19Distributed Access Controller Offline
## EVENT_ACS_LOCAL_CONTROL_
## RESUME
20Distributed Access Controller Online
## EVENT_ACS_LOCAL_
## DOWNSIDE_RS485_
## LOOPNODE_BROKEN
21Downstream RS485 Loop of Distributed Access
## Control Disconnected
## EVENT_ACS_LOCAL_
## DOWNSIDE_RS485_
## LOOPNODE_RESUME
22Downstream RS485 Loop of Distributed Access
## Control Connected
Intelligent Security API (Access Control on Person) Developer Guide
## 374

Minor TypeValueDescription
## EVENT_ACS_DISTRACT_
## CONTROLLER_ONLINE
23Distributed Elevator Controller Online
## EVENT_ACS_DISTRACT_
## CONTROLLER_OFFLINE
24Distributed Elevator Controller Offline
## EVENT_ACS_FIRE_BUTTON_
## TRIGGER
25Fire Button Pressed
## EVENT_ACS_FIRE_BUTTON_
## RESUME
26Fire Button Released
## EVENT_ACS_MAINTENANCE_
## BUTTON_TRIGGER
27Maintenance Button Pressed
## EVENT_ACS_MAINTENANCE_
## BUTTON_RESUME
28Maintenance Button Released
## EVENT_ACS_EMERGENCY_
## BUTTON_TRIGGER
29Panic Button Pressed
## EVENT_ACS_EMERGENCY_
## BUTTON_RESUME
30Panic Button Released
## EVENT_ACS_
## SUBMARINEBACK_COMM_
## BREAK
32Communication with Anti-​passing Back Server
## Failed
## EVENT_ACS_
## SUBMARINEBACK_COMM_
## RESUME
33Communication with Anti-​passing Back Server
## Restored
## EVENT_ACS_REMOTE_
## ACTUAL_GUARD
34Remotely Armed
## EVENT_ACS_REMOTE_
## ACTUAL_UNGUARD
35Remotely Disarmed
## EVENT_ACS_MOTOR_SENSOR_
## EXCEPTION
36Motor or Sensor Exception
## EVENT_ACS_CAN_BUS_
## EXCEPTION
37CAN Bus Exception
## EVENT_ACS_CAN_BUS_
## RESUME
38CAN Bus Restored
## EVENT_ACS_GATE_
## TEMPERATURE_OVERRUN
39Too High Pedestal Temperature
Intelligent Security API (Access Control on Person) Developer Guide
## 375

Minor TypeValueDescription
## EVENT_ACS_IR_EMITTER_
## EXCEPTION
40Active Infrared Intrusion Detector Exception
## EVENT_ACS_IR_EMITTER_
## RESUME
41Active Infrared Intrusion Detector Restored
## EVENT_ACS_LAMP_BOARD_
## COMM_EXCEPTION
42Communication with Light Board Failed
## EVENT_ACS_LAMP_BOARD_
## COMM_RESUME
43Communication with Light Board Restored
## EVENT_ACS_IR_ADAPTOR_
## BOARD_COMM_EXCEPTION
44Communication with IR Adaptor Failed
## EVENT_ACS_IR_ADAPTOR_
## BOARD_COMM_RESUME
45Communication with IR Adaptor Restored
## EVENT_ACS_CHANNEL_
## CONTROLLER_DESMANTLE_
## ALARM
46Lane Controller Tampering Alarm
## EVENT_ACS_CHANNEL_
## CONTROLLER_DESMANTLE_
## RESUME
47Lane Controller Tampering Alarm Restored
## EVENT_ACS_CHANNEL_
## CONTROLLER_FIRE_IMPORT_
## ALARM
48Lane Controller Fire Input Alarm
## EVENT_ACS_CHANNEL_
## CONTROLLER_FIRE_IMPORT_
## RESUME
49Lane Controller Fire Input Alarm Restored
EVENT_ACS_STAY_EVENT/Staying Event
## EVENT_ACS_LEGAL_EVENT_
## NEARLY_FULL
/No Memory Alarm for Valid Offline Event Storage
## Alarm Input Event Linkage
Minor TypeValueDescription
## EVENT_ACS_ALARMIN_
## SHORT_CIRCUIT
0Zone Short Circuit Attempts
## Alarm
## EVENT_ACS_ALARMIN_
## BROKEN_CIRCUIT
1Zone Open Circuit Attempts
## Alarm
Intelligent Security API (Access Control on Person) Developer Guide
## 376

Minor TypeValueDescription
## EVENT_ACS_ALARMIN_
## EXCEPTION
2Zone Exception Alarm
## EVENT_ACS_ALARMIN_
## RESUME
3Zone Alarm Restored
## EVENT_ACS_CASE_SENSOR_
## ALARM
4Alarm Input Alarm
## EVENT_ACS_CASE_SENSOR_
## RESUME
5Alarm Input Alarm Restored
## Access Control Point Event Linkage
Minor TypeValueDescription
## EVENT_ACS_LEADER_CARD_
## OPEN_BEGIN
0Open Door with First Card
## Started
## EVENT_ACS_LEADER_CARD_
## OPEN_END
1Open Door with First Card
## Ended
## EVENT_ACS_ALWAYS_OPEN_
## BEGIN
2Remain Open Started
## EVENT_ACS_ALWAYS_OPEN_
## END
3Remain Open Ended
## EVENT_ACS_ALWAYS_CLOSE_
## BEGIN
4Remain Closed Started
## EVENT_ACS_ALWAYS_CLOSE_
## END
5Remain Closed Ended
EVENT_ACS_LOCK_OPEN6Door Unlocked
EVENT_ACS_LOCK_CLOSE7Door Locked
## EVENT_ACS_DOOR_BUTTON_
## PRESS
8Exit Button Pressed
## EVENT_ACS_DOOR_BUTTON_
## RELEASE
9Exit Button Released
## EVENT_ACS_DOOR_OPEN_
## NORMAL
10Door Open (Contact)
## EVENT_ACS_DOOR_CLOSE_
## NORMAL
11Door Closed (Contact)
Intelligent Security API (Access Control on Person) Developer Guide
## 377

Minor TypeValueDescription
## EVENT_ACS_DOOR_OPEN_
## ABNORMAL
12Door Abnormally Open
(Contact)
## EVENT_ACS_DOOR_OPEN_
## TIMEOUT
13Door Open Timed Out
(Contact)
## EVENT_ACS_REMOTE_OPEN_
## DOOR
14Door Remotely Open
## EVENT_ACS_REMOTE_CLOSE_
## DOOR
15Door Remotely Closed
## EVENT_ACS_REMOTE_
## ALWAYS_OPEN
16Remain Open Remotely
## EVENT_ACS_REMOTE_
## ALWAYS_CLOSE
17Remain Closed Remotely
## EVENT_ACS_NOT_BELONG_
## MULTI_GROUP
18Card Not in Multiple
## Authentication Group
## EVENT_ACS_INVALID_MULTI_
## VERIFY_PERIOD
19Card Not in Multiple
## Authentication Duration
## EVENT_ACS_MULTI_VERIFY_
## SUPER_RIGHT_FAIL
20Multiple Authentication Mode:
## Super Password Authentication
## Failed
## EVENT_ACS_MULTI_VERIFY_
## REMOTE_RIGHT_FAIL
21Multiple Authentication Mode:
## Remote Authentication Failed
## EVENT_ACS_MULTI_VERIFY_
## SUCCESS
22Multiple Authentication
## Completed
## EVENT_ACS_MULTI_VERIFY_
## NEED_REMOTE_OPEN
23Multiple Authentication:
## Remotely Open Door
## EVENT_ACS_MULTI_VERIFY_
## SUPERPASSWD_VERIFY_
## SUCCESS
24Multiple Authentication: Super
## Password Authentication
## Completed
## EVENT_ACS_MULTI_VERIFY_
## REPEAT_VERIFY_FAIL
25Multiple Authentication:
## Repeated Authentication Failed
## EVENT_ACS_MULTI_VERIFY_
## TIMEOUT
26Multiple Authentication Timed
## Out
## EVENT_ACS_REMOTE_
## CAPTURE_PIC
27Remote Capture
Intelligent Security API (Access Control on Person) Developer Guide
## 378

Minor TypeValueDescription
## EVENT_ACS_DOORBELL_
## RINGING
28Doorbell Ring
## EVENT_ACS_SECURITY_
## MODULE_DESMANTLE_ALARM
29Secure Door Control Unit
## Tampering Alarm
EVENT_ACS_CALL_CENTER30Center Event
## EVENT_ACS_FIRSTCARD_
## AUTHORIZE_BEGIN
31First Card Authentication
## Started
## EVENT_ACS_FIRSTCARD_
## AUTHORIZE_END
32First Card Authentication End
## EVENT_ACS_DOORLOCK_
## INPUT_SHORT_CIRCUIT
33Lock Input Short Circuit
## Attempts Alarm
## EVENT_ACS_DOORLOCK_
## INPUT_BROKEN_CIRCUIT
34Lock Input Open Circuit
## Attempts Alarm
## EVENT_ACS_DOORLOCK_
## INPUT_EXCEPTION
35Lock Input Exception Alarm
## EVENT_ACS_DOORCONTACT_
## INPUT_SHORT_CIRCUIT
36Contact Input Short Circuit
## Attempts Alarm
## EVENT_ACS_DOORCONTACT_
## INPUT_BROKEN_CIRCUIT
37Contact Input Open Circuit
## Attempts Alarm
## EVENT_ACS_DOORCONTACT_
## INPUT_EXCEPTION
38Contact Input Exception Alarm
## EVENT_ACS_OPENBUTTON_
## INPUT_SHORT_CIRCUIT
39Exit Button Input Short Circuit
## Attempts Alarm
## EVENT_ACS_OPENBUTTON_
## INPUT_BROKEN_CIRCUIT
40Exit Button Input Open Circuit
## Attempts Alarm
## EVENT_ACS_OPENBUTTON_
## INPUT_EXCEPTION
41Exit Button Input Exception
## Alarm
## EVENT_ACS_DOORLOCK_
## OPEN_EXCEPTION
42Unlocking Exception
## EVENT_ACS_DOORLOCK_
## OPEN_TIMEOUT
43Unlocking Timed Out
## EVENT_ACS_FIRSTCARD_
## OPEN_WITHOUT_AUTHORIZE
44Unauthorized First Card
## Opening Failed
Intelligent Security API (Access Control on Person) Developer Guide
## 379

Minor TypeValueDescription
## EVENT_ACS_CALL_LADDER_
## RELAY_BREAK
45Call Elevator Relay Open
## EVENT_ACS_CALL_LADDER_
## RELAY_CLOSE
46Call Elevator Relay Closed
## EVENT_ACS_AUTO_KEY_
## RELAY_BREAK
47Auto Button Relay Open
## EVENT_ACS_AUTO_KEY_
## RELAY_CLOSE
48Auto Button Relay Closed
## EVENT_ACS_KEY_CONTROL_
## RELAY_BREAK
49Button Relay Open
## EVENT_ACS_KEY_CONTROL_
## RELAY_CLOSE
50Button Relay Closed
## EVENT_ACS_REMOTE_
## VISITOR_CALL_LADDER
51Visitor Calling Elevator
## EVENT_ACS_REMOTE_
## HOUSEHOLD_CALL_LADDER
52Resident Calling Elevator
EVENT_ACS_LEGAL_MESSAGE52Valid Message
## EVENT_ACS_ILLEGAL_
## MESSAGE
53Invalid Message
EVENT_ACS_TRAILING54Tailgating
EVENT_ACS_REVERSE_ACCESS55Reverse Passing
EVENT_ACS_FORCE_ACCESS56Force Collision
## EVENT_ACS_CLIMBING_OVER_
## GATE
57Climbing Over
## EVENT_ACS_PASSING_
## TIMEOUT
58Passing Timed Out
## EVENT_ACS_INTRUSION_
## ALARM
59Intrusion Alarm
## EVENT_ACS_FREE_GATE_PASS_
## NOT_AUTH
60Authentication Failed When
## Free Passing
## EVENT_ACS_DROP_ARM_
## BLOCK
61Barrier Obstructed
Intelligent Security API (Access Control on Person) Developer Guide
## 380

Minor TypeValueDescription
## EVENT_ACS_DROP_ARM_
## BLOCK_RESUME
62Barrier Restored
## EVENT_ACS_REMOTE_
## CONTROL_CLOSE_DOOR
63Door Closed via Keyfob
## EVENT_ACS_REMOTE_
## CONTROL_OPEN_DOOR
64Door Opened via Keyfob
## EVENT_ACS_REMOTE_
## CONTROL_ALWAYS_OPEN_
## DOOR
65Remain Open via Keyfob
## Authentication Unit Event Linkage
Minor TypeValueDescription
EVENT_ACS_STRESS_ALARM0Duress Alarm
## EVENT_ACS_CARD_READER_
## DESMANTLE_ALARM
1Card Reader Tampering Alarm
## EVENT_ACS_LEGAL_CARD_
## PASS
2Valid Card Authentication
## Completed
## EVENT_ACS_CARD_AND_PSW_
## PASS
3Card and Password
## Authentication Completed
## EVENT_ACS_CARD_AND_PSW_
## FAIL
4Card and Password
## Authentication Failed
## EVENT_ACS_CARD_AND_PSW_
## TIMEOUT
5Card and Password
## Authentication Timed Out
## EVENT_ACS_CARD_MAX_
## AUTHENTICATE_FAIL
6Card Authentication Attempts
## Reach Limit
EVENT_ACS_CARD_NO_RIGHT7No Permission for Card
## EVENT_ACS_CARD_INVALID_
## PERIOD
8Invalid Card Swiping Time
## Period
## EVENT_ACS_CARD_OUT_OF_
## DATE
9Expired Card
EVENT_ACS_INVALID_CARD10Card No. Not Exist
EVENT_ACS_ANTI_SNEAK_FAIL11Anti-​passing Back
## Authentication Failed
Intelligent Security API (Access Control on Person) Developer Guide
## 381

Minor TypeValueDescription
## EEVENT_ACS_INTERLOCK_
## DOOR_NOT_CLOSE
12Interlocking Door Not Closed
## EVENT_ACS_FINGERPRINT_
## COMPARE_PASS
13Fingerprint Matched
## EVENT_ACS_FINGERPRINT_
## COMPARE_FAIL
14Fingerprint Mismatched
## EVENT_ACS_CARD_
## FINGERPRINT_VERIFY_PASS
15Card and Fingerprint
## Authentication Completed
## EVENT_ACS_CARD_
## FINGERPRINT_VERIFY_FAIL
16Card and Fingerprint
## Authentication Failed
## EVENT_ACS_CARD_
## FINGERPRINT_VERIFY_
## TIMEOUT
17Card and Fingerprint
## Authentication Timed Out
## EVENT_ACS_CARD_
## FINGERPRINT_PASSWD_
## VERIFY_PASS
18Card, Fingerprint, and
## Password Authentication
## Completed
## EVENT_ACS_CARD_
## FINGERPRINT_PASSWD_
## VERIFY_FAIL
19Card and Fingerprint
## Authentication Failed
## EVENT_ACS_CARD_
## FINGERPRINT_PASSWD_
## VERIFY_TIMEOUT
20Card and Fingerprint
## Authentication Timed Out
## EVENT_ACS_FINGERPRINT_
## PASSWD_VERIFY_PASS
21Fingerprint and Password
## Authentication Completed
## EVENT_ACS_FINGERPRINT_
## PASSWD_VERIFY_FAIL
22Fingerprint and Password
## Authentication Failed
## EVENT_ACS_FINGERPRINT_
## PASSWD_VERIFY_TIMEOUT
23Fingerprint and Password
## Authentication Timed Out
## EVENT_ACS_FINGERPRINT_
## INEXISTENCE
24Fingerprint Not Exist
## EVENT_ACS_EMPLOYEENO_
## AND_FP_VERIFY_PASS
42Employee ID and Fingerprint
## Authentication Completed
## EVENT_ACS_EMPLOYEENO_
## AND_FP_VERIFY_FAIL
43Employee ID and Fingerprint
## Authentication Failed
Intelligent Security API (Access Control on Person) Developer Guide
## 382

Minor TypeValueDescription
## EVENT_ACS_EMPLOYEENO_
## AND_FP_VERIFY_TIMEOUT
44Employee ID and Fingerprint
## Authentication Timed Out
## EVENT_ACS_EMPLOYEENO_
## AND_FP_AND_PW_VERIFY_
## PASS
45Employee ID, Fingerprint, and
## Password Authentication
## Completed
## EVENT_ACS_EMPLOYEENO_
## AND_FP_AND_PW_VERIFY_
## FAIL
46Employee ID, Fingerprint, and
## Password Authentication Failed
## EVENT_ACS_EMPLOYEENO_
## AND_FP_AND_PW_VERIFY_
## TIMEOUT
47Employee ID, Fingerprint, and
## Password Authentication
## Timed Out
## EVENT_ACS_EMPLOYEENO_
## AND_PW_PASS
52Employee ID and Password
## Authentication Completed
## EVENT_ACS_EMPLOYEENO_
## AND_PW_FAIL
52Employee ID and Password
## Authentication Failed
## EVENT_ACS_EMPLOYEENO_
## AND_PW_TIMEOUT
53Employee ID and Password
## Authentication Timed Out
## EVENT_ACS_DOOR_OPEN_OR_
## DORMANT_FAIL
57Authentication Failed When
Door Remain Closed or Door in
## Sleeping Mode
## EVENT_ACS_AUTH_PLAN_
## DORMANT_FAIL
58Authentication Failed When
Authentication Schedule in
## Sleeping Mode
## EVENT_ACS_CARD_ENCRYPT_
## VERIFY_FAIL
59Card Encryption Verification
## Failed
## EVENT_ACS_
## SUBMARINEBACK_REPLY_FAIL
60Anti-​passing Back Server
## Response Failed
## EVENT_ACS_PASSWORD_
## MISMATCH
61Password Mismatched
## EVENT_ACS_EMPLOYEE_NO_
## NOT_EXIST
62Employee ID Not Exist
## EVENT_ACS_COMBINED_
## VERIFY_PASS
63Combined Authentication
## Completed
## EVENT_ACS_COMBINED_
## VERIFY_TIMEOUT
64Combined Authentication
## Timed Out
Intelligent Security API (Access Control on Person) Developer Guide
## 383

Minor TypeValueDescription
## EVENT_ACS_VERIFY_MODE_
## MISMATCH
65Authentication Type
## Mismatched
## EVENT_ACS_PSW_ERROR_
## OVER_TIMES
67Maximum Password
## Authentication Failure
## Attempts
EVENT_ACS_PSW_VERIFY_PASS68Password Authenticated
EVENT_ACS_PSW_VERIFY_FAIL69Password Authentication Failed
## EVENT_ACS_ORCODE_VERIFY_
## PASS
70QR Code Authenticated
## EVENT_ACS_ORCODE_VERIFY_
## FAIL
71QR Code Authentication Failed
## EVENT_ACS_HOUSEHOLDER_
## AUTHORIZE_PASS
72Resident Authorization
## Authenticated
## EVENT_ACS_BLUETOOTH_
## VERIFY_PASS
73Bluetooth Authenticated
## EVENT_ACS_BLUETOOTH_
## VERIFY_FAIL
74Bluetooth Authentication
## Failed
## EVENT_ACS_INFORMAL_
## MIFARE_CARD_VERIFY_FAIL
/Authentication Failed: Invalid
## Mifare Card
## EVENT_ACS_CPU_CARD_
## ENCRYPT_VERIFY_FAIL
/Verifying CPU Card Encryption
## Failed
## EVENT_ACS_NFC_DISABLE_
## VERIFY_FAIL
/Disabling NFC Verification
## Failed
## EVENT_ACS_EM_CARD_
## RECOGNIZE_NOT_ENABLED
/EM Card Recognition Disabled
## EVENT_ACS_M1_CARD_
## RECOGNIZE_NOT_ENABLED
/M1 Card Recognition Disabled
## EVENT_ACS_CPU_CARD_
## RECOGNIZE_NOT_ENABLED
/CPU Card Recognition Disabled
## EVENT_ACS_ID_CARD_
## RECOGNIZE_NOT_ENABLED
/ID Card Recognition Disabled
## EVENT_ACS_CARD_SET_
## SECRET_KEY_FAIL
/Importing Key to Card Failed
Intelligent Security API (Access Control on Person) Developer Guide
## 384

A.3 Error Codes in ResponseStatus
The error classification returned by the ResponseStatus message is based on the status codes of
HTTP protocol. 7 kinds of status codes are predefined, including 1 (OK), 2 (Device Busy), 3 (Device
Error), 4 (Invalid Operation), 5 (Invalid Message Format), 6 (Invalid Message Content), and 7
(Reboot Required). Each kind of status code contains
multiple sub status codes, and the error
codes are in a one-to-one correspondence with the sub status codes.
StatusCode=1
SubStatusCodeError CodeDescription
ok0x1Operation completed.
riskPassword0x10000002Risky password.
armProcess0x10000005Arming process.
StatusCode=2
Sub Status CodeError CodeDescription
noMemory0x20000001Insufficient memory.
serviceUnavailable0x20000002The service is not available.
upgrading0x20000003Upgrading.
deviceBusy0x20000004The device is busy or no
response.
reConnectIpc0x20000005The video server is
reconnected.
transferUpgradePackageFailed0x20000006Transmitting device upgrade
data failed.
startUpgradeFailed0x20000007Starting upgrading device
failed.
getUpgradeProcessfailed.0x20000008Getting upgrade status failed.
certificateExist0x2000000BThe Authentication certificate
already exists.
Intelligent Security API (Access Control on Person) Developer Guide
## 385

StatusCode=3
Sub Status CodeError CodeDescription
deviceError0x30000001Hardware error.
badFlash0x30000002Flash operation error.
28181Uninitialized0x30000003The 28181 configuration is not
initialized.
socketConnectError0x30000005Connecting to socket failed.
receiveError0x30000007Receive response message
failed.
deletePictureError0x3000000ADeleting picture failed.
pictureSizeExceedLimit0x3000000CToo large picture size.
clearCacheError0x3000000DClearing cache failed.
updateDatabasError0x3000000FUpdating database failed.
searchDatabaseError0x30000010Searching in the database
failed.
writeDatabaseError0x30000011Writing to database failed.
deleteDatabaseError0x30000012Deleting database element
failed.
searchDatabaseElementError0x30000013Getting number of database
elements failed.
cloudAutoUpgradeException0x30000016Downloading upgrade packet
from cloud and upgrading
failed.
HBPException0x30001000HBP exception.
UDEPException0x30001001UDEP exception
elasticSearchException0x30001002Elastic exception.
kafkaException0x30001003Kafka exception.
HBaseException0x30001004Hbase exception.
sparkException0x30001005Spark exception.
yarnException0x30001006Yarn exception.
cacheException0x30001007Cache exception.
Intelligent Security API (Access Control on Person) Developer Guide
## 386

Sub Status CodeError CodeDescription
trafficException0x30001008Monitoring point big data
server exception.
faceException0x30001009Human face big data server
exception.
SSDFileSystemIsError0x30001013SSD file system error (Error
occurs when it is non-Ext4 file
system)
insufficientSSDCapacityForFPD0x30001014Insufficient SSD space for
person frequency detection
wifiException0x3000100AWi-Fi big data server exception.
structException0x3000100DVideo parameters structure
server exception.
captureTimeout0x30006000Data collection timed out.
lowScore0x30006001Low quality of collected data.
uploadingFailed0x30007004Uploading failed.
StatusCode=4
Sub Status CodeError CodeDescription
notSupport0x40000001Not supported.
lowPrivilege0x40000002No permission.
badAuthorization0x40000003Authentication failed.
methodNotAllowed0x40000004Invalid HTTP method.
notSetHdiskRedund0x40000005Setting spare HDD failed.
invalidOperation0x40000006Invalid operation.
hdFormatFail\Formatting HDD failed.
notActivated0x40000007Inactivated.
hasActivated0x40000008Activated.
certificateAlreadyExist0x40000009The certificate already exists.
operateFailed0x4000000FOperation failed.
USBNotExist0x40000010USB device is not connected.
Intelligent Security API (Access Control on Person) Developer Guide
## 387

Sub Status CodeError CodeDescription
upgradePackageMoret
han2GB
0x40001000Up to 2GB upgrade package is allowed to be
uploaded.
IDNotexist0x40001001The ID does not exist.
synchronizationError0x40001003Synchronization failed.
synchronizing0x40001004Synchronizing.
importError0x40001005Importing failed.
importing0x40001006Importing.
fileAlreadyExists0x40001007The file already exists.
invalidID0x40001008Invalid ID.
backupnodeNotAllowe
## Log
0x40001009Accessing to backup node is not allowed.
exportingError0x4000100AExporting failed.
exporting0x4000100BExporting.
exportEnded0x4000100CExporting stopped.
exported0x4000100DExported.
IPOccupied0x4000100EThe IP address is already occupied.
IDAlreadyExists0x4000100FThe ID already exists.
exportItemsExceedLimi
t
0x40001010No more items can be exported.
noFiles0x40001011The file does not exist.
beingExportedByAnoth
erUser
0x40001012Being exported by others.
needReAuthentication0x40001013Authentication is needed after upgrade.
unitAddNotOnline0x40001015The added data analysis server is offline.
unitControl0x40001016The data analysis server is already added.
analysis unitFull0x40001017No more data analysis server can be added.
unitIDError0x40001018The data analysis server ID does not exist.
unitExit0x40001019The data analysis server already exists in the
list.
unitSearch0x4000101ASearching data analysis server in the list failed.
Intelligent Security API (Access Control on Person) Developer Guide
## 388

Sub Status CodeError CodeDescription
unitNotOnline0x4000101BThe data analysis server is offline.
unitInfoEror0x4000101CGetting data analysis server information failed.
unitGetNodeInfoError0x4000101DGetting node information failed.
unitGetNetworkInfoErr
or
0x4000101EGetting the network information of data
analysis server failed
unitSetNetworkInfoErr
or
0x4000101FSetting the network information of data analysis
server failed
setSmartNodeInfoError0x40001020Setting node information failed.
setUnitNetworkInfoErr
or
0x40001021Setting data analysis server network
information failed.
unitRestartCloseError0x40001022Rebooting or shutting down data analysis server
failed.
virtualIPnotAllowed0x40001023Adding virtual IP address is not allowed.
unitInstalled0x40001024The data analysis server is already installed.
badSubnetMask0x40001025Invalid subnet mask.
uintVersionMismatche
d
0x40001026Data analysis server version mismatches.
deviceMOdelMismatch
ed
0x40001027Adding failed. Device model mismatches.
unitAddNotSelf0x40001028Adding peripherals is not allowed.
noValidUnit0x40001029No valid data analysis server.
unitNameDuplicate0x4000102ADuplicated data analysis server name.
deleteUnitFirst0x4000102BDelete the added data analysis server of the
node first.
getLocalInfoFailed0x4000102CGetting the server information failed.
getClientAddedNodeFa
iled
0x4000102DGetting the added node information of data
analysis server failed.
taskExit0x4000102EThe task already exists.
taskInitError0x4000102FInitializing task failed.
taskSubmitError0x40001030Submiting task failed.
taskDelError0x40001031Deleting task failed.
Intelligent Security API (Access Control on Person) Developer Guide
## 389

Sub Status CodeError CodeDescription
taskPauseError0x40001032Pausing task failed.
taskContinueError0x40001033Starting task failed.
taskSeverNoCfg0x40001035Full-text search server is not configured.
taskPicSeverNoCfg0x40001036The picture server is not configured.
taskStreamError0x40001037Streaming information exception.
taskRecSDK0x40001038History recording is not supported.
taskCasaError0x4000103ACascading is not supported.
taskVCARuleError0x4000103BInvalid VCA rule.
taskNoRun0x4000103CThe task is not executed.
unitLinksNoStorageNo
de
0x4000103DNo node is linked with the data analysis server.
Configure the node first.
searchFailed0x4000103ESearching video files failed.
searchNull0x4000103FNo video clip.
userScheOffline0x40001040The task scheduler service is offline.
updateTypeUnmatche
d
0x40001041The upgrade package type mismatches.
userExist0x40001043The user already exists.
userCannotDelAdmin0x40001044The administrator cannot be deleted.
userInexistence0x40001045The user name does not exist.
userCannotCreatAdmi
n
0x40001046The administrator cannot be created.
monitorCamExceed0x40001048Up to 3000 cameras can be added.
monitorCunitOverLimit0x40001049Adding failed. Up to 5 lower-levels are
supported by the control center.
monitorReginOverLimit0x4000104AAdding failed. Up to 5 lower-levels are
supported by the area.
monitorArming0x4000104BThe camera is already armed. Disarm the
camera and try again.
monitorSyncCfgNotSet0x4000104CThe system parameters are not configured.
monitorFdSyncing0x4000104ESynchronizing. Try again after completing the
synchronization.
Intelligent Security API (Access Control on Person) Developer Guide
## 390

Sub Status CodeError CodeDescription
monitorParseFailed0x4000104FParsing camera information failed.
monitorCreatRootFaile
d
0x40001050Creating resource node failed.
deleteArmingInfo0x40001051The camera is already . Disarm the camera and
try again.
cannotModify0x40001052Editing is not allowed. Select again.
cannotDel0x40001053Deletion is not allowed. Select again.
deviceExist0x40001054The device already exists.
IPErrorConnectFailed0x40001056Connection failed. Check the network port.
cannotAdd0x40001057Only the capture cameras can be added.
serverExist0x40001058The server already exists.
fullTextParamError0x40001059Incorrect full-text search parameters.
storParamError0x4000105AIncorrect storage server parameters.
picServerFull0x4000105BThe storage space of picture storage server is
full.
NTPUnconnect0x4000105CConnecting to NTP server failed. Check the
parameters.
storSerConnectFailed0x4000105DConnecting to storage server failed. Check the
network port.
storSerLoginFailed0x4000105ELogging in to storage server failed. Check the
user name and password.
searchSerConnectFaile
d
0x4000105FConnecting to full-text search server failed.
Check the network port.
searchSerLoginFailed0x40001060Logging in to full-text search server failed.
Check the user name and password.
kafkaConnectFailed0x40001061Connecting to Kafka failed. Check the network
port.
mgmtConnectFailed0x40001062Connecting to system failed. Check the network
port.
mgmtLoginFailed0x40001063Logging in to system failed. Check the user
name and password.
Intelligent Security API (Access Control on Person) Developer Guide
## 391

Sub Status CodeError CodeDescription
TDAConnectFailed0x40001064Connecting to traffic data access server failed.
Checking the server status.
86sdkConnectFailed0x40001065Connecting to listening port of iVMS-8600
System failed. Check the parameters.
nameExist0x40001066Duplicated server name.
batchProcessFailed0x40001067Processing in batch failed.
IDNotExist0x40001068The server ID does not exist.
serviceNumberReache
sLimit
0x40001069No more service can be added.
invalidServiceType.0x4000106AInvalid service type.
clusterGetInfo0x4000106BGetting cluster group information failed.
clusterDelNode0x4000106CDeletion node failed.
clusterAddNode0x4000106DAdding node failed.
clusterInstalling0x4000106ECreating cluster...Do not operate.
clusterUninstall0x4000106FReseting cluster...Do not operate.
clusterInstall0x40001070Creating cluster failed.
clusterIpError0x40001071Invalid IP address of task scheduler server.
clusterNotSameSeg0x40001072The master node and slave node must be in the
same network segment.
clusterVirIpError0x40001073Automatically getting virtual IP address failed.
Enter manually.
clusterNodeUnadd0x40001074The specified master(slave) node is not added.
clusterNodeOffline0x40001075The task scheduler server is offline.
nodeNotCurrentIP0x40001076The analysis node of the current IP address is
required when adding master and slave nodes.
addNodeNetFailed0x40001077Adding node failed. The network disconnected.
needTwoMgmtNode0x40001078Two management nodes are required when
adding master and slave nodes.
ipConflict0x40001079The virtual IP address and data analysis server's
IP address conflicted.
ipUsed0x4000107AThe virtual IP address has been occupied.
Intelligent Security API (Access Control on Person) Developer Guide
## 392

Sub Status CodeError CodeDescription
cloudAlalyseOnline0x4000107BThe cloud analytic server is online.
virIP&mainIPnotSame
NetSegment
0x4000107CThe virtual IP address is not in the same
network segment with the IP address of
master/slave node.
getNodeDispatchInfoFa
iled
0x4000107DGetting node scheduler information failed.
unableModifyManage
mentNetworkIP
0x4000107EEditing management network interface failed.
The analysis board is in the cluster.
notSpecifyVirtualIP0x4000107FVirtual IP address should be specified for
master and slave cluster.
armingFull0x40001080No more device can be armed.
armingNoFind0x40001081The arming information does not exist.
disArming0x40001082Disarming failed.
getArmingError0x40001084Getting arming information failed.
refreshArmingError0x40001085Refreshing arming information failed.
ArmingPlateSame0x40001086The license plate number is repeatedly armed.
ArmingParseXLSError0x40001087Parsing arming information file failed.
ArmingTimeError0x40001088Invalid arming time period.
ArmingSearchTimeErro
r
0x40001089Invalid search time period.
armingRelationshipRea
chesLimit
0x4000108ANo more relation can be created.
duplicateAarmingNam
e
0x4000108BThe relation name already exists.
noMoreArmingListAdd
ed
0x4000108CNo more blacklist library can be armed.
noMoreCamerasAdded0x4000108DNo more camera can be armed.
noMoreArmingListAdd
edWithCamera
0x4000108ENo more library can be linked to the camera.
noMoreArmingPeriodA
dded
0x4000108FNo more time period can be added to the
arming schedule.
Intelligent Security API (Access Control on Person) Developer Guide
## 393

Sub Status CodeError CodeDescription
armingPeriodsOverlap
ped
0x40001090The time periods in the arming schedule are
overlapped.
noArmingAlarmInfo0x40001091The alarm information does not exist.
armingAlarmUnRead0x40001092Getting number of unread alarms failed.
getArmingAlarmError0x40001093Getting alarm information failed.
searchByPictureTimed
## Out
0x40001094Searching picture by picture timeout. Search
again.
comparisonTimeRange
## Error
0x40001095Comparison time period error.
selectMonitorNumber
UpperLimit
0x40001096No more monitoring point ID can be filtered.
noMoreComparisonTas
ksAdded
0x40001097No more comparison task can be executed at
the same time.
GetComparisonResultF
ailed
0x40001098Getting comparison result failed.
comparisonTypeError0x40001099Comparison type error.
comparisonUnfinished0x4000109AThe comparison is not completed.
facePictureModelInvali
d
0x4000109BInvalid face model.
duplicateLibraryName.0x4000109CThe library name already exists.
noRecord0x4000109DNo record found.
countingRecordsFailed.0x4000109ECalculate the number of records failed.
getHumanFaceFrameF
ailed
0x4000109FGetting face thumbnail from the picture failed.
modelingFailed.0x400010A0Modeling face according to picture URL failed.
1V1FacePictureCompar
isonFailed
0x400010A1Comparison 1 VS 1 face picture failed.
libraryArmed0x400010A2The blacklist library is armed.
licenseExeedLimit0x400010A3Dongle limited.
licenseExpired0x400010A4Dongle expired.
licenseDisabled0x400010A5Unavailable dongle.
Intelligent Security API (Access Control on Person) Developer Guide
## 394

Sub Status CodeError CodeDescription
licenseNotExist0x400010A6The dongle does not exist.
SessionExpired0x400010A7Session expired .
beyondConcurrentLimi
t
0x400010A8Out of concurrent limit.
stopSync0x400010A9Synchronization stopped.
getProgressFaild0x400010AAGetting progress failed.
uploadExtraCaps0x400010ABNo more files can be uploaded.
timeRangeError0x400010ACTime period error.
dataPortNotConnected0x400010ADThe data port is not connected.
addClusterNodeFailed0x400010AEAdding to the cluster failed. The device is
already added to other cluster.
taskNotExist0x400010AFThe task does not exist.
taskQueryFailed0x400010B0Searching task failed.
modifyTimeRuleFailed0x400010B2The task already exists. Editing time rule is not
allowed.
modifySmartRuleFailed0x400010B3The task already exists. Editing VAC rule is not
allowed.
queryHistoryVideoFaile
d
0x400010B4Searching history video failed.
addDeviceFailed0x400010B5Adding device failed.
addVideoFailed0x400010B6Adding video files failed.
deleteAllVideoFailed0x400010B7Deleting all video files failed.
createVideoIndexFailed0x400010B8Indexing video files failed.
videoCheckTypeFailed0x400010B9Verifying video files types failed.
configStructuredAddre
ssFailed
0x400010BAConfiguring IP address of structured server
failed.
configPictureServerAd
dressFailed
0x400010BBConfiguring IP address of picture storaged
server failed.
storageServiceIPNotExi
st
0x400010BDThe storage server IP address does not exist.
Intelligent Security API (Access Control on Person) Developer Guide
## 395

Sub Status CodeError CodeDescription
syncBackupDatabaseFa
iled
0x400010BESynchronizing slave database failed. Try again.
syncBackupNTPTimeFa
iled
0x400010BFSynchronizing NTP time of slave server failed.
clusterNotSelectLoopb
ackAddress
0x400010C0Loopbacl address is not supported by the
master or slave cluster.
addFaceRecordFailed0x400010C1Adding face record failed.
deleteFaceRecordFaile
d
0x400010C2Deleting face record failed.
modifyFaceRecordFaile
d
0x400010C3Editing face record failed.
queryFaceRecordFailed0x400010C4Searching face record failed.
faceDetectFailed0x400010C5Detecting face failed.
libraryNotExist0x400010C6The library does not exist.
blackListQueryExportin
g
0x400010C7Exporting matched blacklists.
blackListQueryExporte
d
0x400010C8The matched blacklists are exported.
blackListQueryStopExp
orting
0x400010C9Exporting matched blacklists is stopped.
blackListAlarmQueryEx
porting
0x400010CAExporting matched blacklist alarms.
blackListAlarmQueryEx
ported
0x400010CBThe matched blacklists alarms are exported.
blackListAlarmQuerySt
opExporting
0x400010CCExporting matched blacklist alarms is stopped.
getBigDataCloudAnalys
isFailed
0x400010CDGetting big data cloud analytic information
failed.
setBigDataCloudAnalys
isFailed
0x400010CEConfiguring big data cloud analytic failed.
submitMapSearchFaile
d
0x400010CFSubmitting search by picture task failed.
Intelligent Security API (Access Control on Person) Developer Guide
## 396

Sub Status CodeError CodeDescription
controlRelationshipNot
## Exist
0x400010D0The relation does not exist.
getHistoryAlarmInfoFai
led
0x400010D1Getting history alarm information failed.
getFlowReportFailed0x400010D2Getting people counting report failed.
addGuardFailed0x400010D3Adding arming configuration failed.
deleteGuardFailed0x400010D4Deleting arming configuration failed.
modifyGuardFailed0x400010D5Editing arming configuration failed.
queryGuardFailed0x400010D6Searching arming configurations failed.
uploadUserSuperCaps0x400010D7No more user information can be uploaded.
bigDataServerConnect
## Failed
0x400010D8Connecting to big data server failed.
microVideoCloudRequ
estInfoBuildFailed
0x400010D9Adding response information of micro video
cloud failed.
microVideoCloudRespo
nseInfoBuildFailed
0x400010DAParsing response information of micro video
cloud failed.
transcodingServerRequ
estInfoBuildFailed
0x400010DBAdding response information of transcoding
server failed.
transcodingServerResp
onseInfoParseFailed
0x400010DCParsing response information of transcoding
server failed.
transcodingServerOffli
ne
0x400010DDTranscoding server is offline.
microVideoCloudOfflin
e
0x400010DEMicro video cloud is offline.
UPSServerOffline0x400010DFUPS monitor server is offline.
statisticReportRequestI
nfoBuildFailed
0x400010E0Adding response information of statistics report
failed.
statisticReportRespons
eInfoParseFailed
0x400010E1Parsing response information of statistics report
failed.
DisplayConfigInfoBuild
## Failed
0x400010E2Adding display configuration information failed.
DisplayConfigInfoParse
## Failed
0x400010E3Parsing display configuration information failed.
Intelligent Security API (Access Control on Person) Developer Guide
## 397

Sub Status CodeError CodeDescription
DisplayConfigInfoSaveF
ailed
0x400010E4Saving display configuration information failed.
notSupportDisplayConf
igType
0x400010E5The display configuration type is not supported.
passError0x400010E7Incorrect password.
upgradePackageLarge0x400010EBToo large upgrade package.
sesssionUserReachesLi
mit
0x400010ECNo more user can log in via session.
## ISO
8601TimeFormatError
0x400010EDInvalid ISO8601 time format.
clusterDissolutionFaile
d
0x400010EEDeleting cluster failed.
getServiceNodeInfoFail
ed
0x400010EFGetting service node information failed.
getUPSInfoFailed0x400010F0Getting UPS configuration information failed.
getDataStatisticsRepor
tFailed
0x400010F1Getting data statistic report failed.
getDisplayConfigInfoFai
led
0x400010F2Getting display configuration failed.
namingAnalysisBoardN
otAllowed
0x400010F3Renaming analysis board is not allowed.
onlyDrawRegionsOfCo
nvexPolygon
0x400010F4Only drawing convex polygon area is supported.
bigDataServerRespons
eInfoParseFailed
0x400010F5Parsing response message of big data service
failed.
bigDataServerReturnFa
iled
0x400010F6No response is returned by big data service.
microVideoReturnFaile
d
0x400010F7No response is returned by micro video cloud
service.
transcodingServerRetu
rnFailed
0x400010F8No response is returned by transcoding service.
UPSServerReturnFailed0x400010F9No response is returned by UPS monitoring
service.
Intelligent Security API (Access Control on Person) Developer Guide
## 398

Sub Status CodeError CodeDescription
forwardingServer
ReturnFailed
0x400010FANo response is returned by forwarding service.
storageServer
ReturnFailed
0x400010FBNo response is returned by storage service.
cloudAnalysisServerRet
urnFailed
0x400010FCNo response is returned by cloud analytic
service.
modelEmpty0x400010FDNo model is obtained.
mainAndBackupNodeC
annotModifyManagem
entNetworkInterfaceIP
0x400010FEEditing the management interface IP address of
master node and backup node is not allowed.
IDTooLong0x400010FFThe ID is too long.
pictureCheckFailed0x40001100Detecting picture failed.
pictureModelingFailed0x40001101Modeling picture failed.
setCloudAnalsisDefault
ProvinceFailed
0x40001102Setting default province of cloud analytic
service failed.
InspectionAreasNumbe
rExceedLimit
0x40001103No more detection regions can be added.
picturePixelsTooLarge0x40001105The picture resolution is too high.
picturePixelsTooSmall0x40001106The picture resolution is too low.
storageServiceIPEmpty0x40001107The storage server IP address is required.
bigDataServerRequestI
nfoBuildFail
0x40001108Creating request message of big data service
failed.
analysiTimedOut0x40001109Analysis time out.
high-
performanceModeDisa
bled.
0x4000110APlease enable high-performance mode.
configuringUPSMonito
ringServerTimedOut
0x4000110BConfigurating the UPS monitoring server time
out. Check IP address.
cloudAnalysisRequestI
nformationBuildFailed
0x4000110CCreating request message of cloud analytic
service failed.
cloudAnalysisResponse
InformationParseFailed
0x4000110DParsing response message of cloud analytic
service failed.
Intelligent Security API (Access Control on Person) Developer Guide
## 399

Sub Status CodeError CodeDescription
allCloudAnalysisInterfa
ceFailed
0x4000110ECalling API for cloud analytic service failed.
cloudAnalysisModelCo
mpareFailed
0x4000110FModel comparison of cloud analytic service
failed.
cloudAnalysisFacePictu
reQualityRatingFailed
0x40001110Getting face quality grading of cloud analytic
service failed.
cloudAnalysisExtractFe
aturePointsFailed
0x40001111Extracting feature of cloud analytic service
failed.
cloudAnalysisExtractPr
opertyFailed
0x40001112Extracting property of cloud analytic service
failed.
getAddedNodeInformat
ionFailed
0x40001113Getting the added nodes information of data
analysis server failed.
noMoreAnalysisUnitsA
dded
0x40001114No more data analysis servers can be added.
detectionAreaInvalid0x40001115Invalid detection region.
shieldAreaInvalid0x40001116Invalid shield region.
noMoreShieldAreasAd
ded
0x40001117No more shield region can be drawn.
onlyAreaOfRectangleS
hapeAllowed
0x40001118Only drawing rectangle is allowed in detection
area.
numberReachedLlimit0x40001119Number reached the limit.
wait1~3MinutesGetIPAf
terSetupDHCP
0x4000111AWait 1 to 3 minutes to get IP address after
configuring DHCP.
plannedTimeMustbeH
alfAnHour
0x4000111BSchedule must be half an hour.
oneDeviceCannotBuild
## Cluster
0x4000111CCreating master and backup cluster requires at
least two devices.
updatePackageFileNot
## Uploaded
0x4000111EUpgrade package is not uploaded.
highPerformanceTasks
NotSupportDrawingDe
tectionRegions
0x4000111FDrawing detection area is not allowed under
high-performance mode.
Intelligent Security API (Access Control on Person) Developer Guide
## 400

Sub Status CodeError CodeDescription
controlCenterIDDoesN
otExist
0x40001120The control center ID does not exist.
regionIDDoesNotExist0x40001121The area ID does not exist.
licensePlateFormatErro
r
0x40001122Invalid license plate format.
managementNodeDoe
sNotSupportThisOperat
ion
0x40001123The operation is not supported.
searchByPictureResour
ceNotConfiged
0x40001124The conditions for searching picture by picture
are not configured.
videoFileEncapsulation
FormatNotSupported
0x40001125The video container format is not supported.
videoPackageFailure0x40001126Converting video container format failed.
videoCodingFormatNot
## Supported
0x40001127Video coding format is not supported.
monitorOfDeviceArmin
gdeleteArmingInfo
0x40001129The camera is armed. Disarm it and try again.
getVideoSourceTypeFai
led
0x4000112AGetting video source type failed.
smartRulesBuildFailed0x4000112BCreating VAC rule failed.
smartRulesParseFailed0x4000112CParsing VAC rule failed.
timeRulesBuildFailed0x4000112DCreating time rule failed.
timeRulesParseFailed0x4000112EParsing time rule failed.
monitoInfoInvalid0x4000112FInvalid camera information.
addingFailedVersionMi
smatches
0x40001130Adding failed. The device version mismatches.
theInformationReturne
dAfterCloudAnalysisIsE
mpty
0x40001131No response is returned by the cloud analytic
service.
selectingIpAddressOfH
ostAndSpareNodeFaile
dCheckTheStatus
0x40001132Setting IP address for master node and backup
node failed. Check the node status.
Intelligent Security API (Access Control on Person) Developer Guide
## 401

Sub Status CodeError CodeDescription
theSearchIdDoesNotEx
ist
0x40001133The search ID does not exist.
theSynchronizationIdD
oesNotExist
0x40001134The synchronization ID does not exist.
theUserIdDoesNotExist0x40001136The user ID does not exist.
theIndexCodeDoesNot
## Exist
0x40001138The index code does not exist.
theControlCenterIdDoe
sNotExist
0x40001139The control center ID does not exist.
theAreaIdDoesNotExist0x4000113AThe area ID does not exist.
theArmingLinkageIdDo
esNotExist
0x4000113CThe arming relationship ID does not exist.
theListLibraryIdDoesNo
tExist
0x4000113DThe list library ID does not exist.
invalidCityCode0x4000113EInvalid city code.
synchronizingThePass
wordOfSpareServerFail
ed
0x4000113FSynchronizing backup system password failed.
editingStreamingTypeIs
NotSupported
0x40001140Editing streaming type is not supported.
switchingScheduledTas
kToTemporaryTaskIsNo
tSupported
0x40001141Switching scheduled task to temporary task is
not supported.
switchingTemporaryTas
kToScheduledTaskIsNot
## Supported
0x40001142Switching temporary task to scheduled task is
not supported.
theTaskIsNotDispatche
dOrItIsUpdating
0x40001143The task is not dispatched or is updating.
thisTaskDoesNotExist0x40001144This task does not exist in the cloud analytic
serice.
duplicatedSchedule0x40001145Schedule period cannot be overlapped.
continuousScheduleWi
thSameAlgorithmType
ShouldBeMerged
0x40001146The continuous schedule periods with same
algorithm type should be merged.
Intelligent Security API (Access Control on Person) Developer Guide
## 402

Sub Status CodeError CodeDescription
invalidStreamingTimeR
ange
0x40001147Invalid streaming time period.
invalidListLibraryType0x40001148Invalid list library type.
theNumberOfMatched
ResultsShouldBeLarger
## Than0
0x40001149The number of search results should be larger
than 0.
invalidValueRangeOfSi
milarity
0x4000114AInvalid similarity range.
invalidSortingType0x4000114BInvalid sorting type.
noMoreListLibraryCanB
eLinkedToTheDevice
0x4000114CNo more lists can be added to one device.
InvalidRecipientAddres
sFormat
0x4000114DInvalid address format of result receiver.
creatingClusterFailedT
heDongleIsNotPlugged
## In
0x4000114EInsert the dongle before creating cluster.
theURLIsTooLong0x4000114FNo schedule configured for the task.
noScheduleIsConfigure
dForTheTask
0x40001150No schedule configured for the task.
theDongleIsExpiried0x40001151Dongle has expired.
dongleException0x40001152Dongle exception.
invalidKey0x40001153Invalid authorization service key.
decryptionFailed0x40001154Decrypting authorization service failed.
encryptionFailed0x40001155Encrypting authorization service failed.
AuthorizeServiceRespo
nseError
0x40001156Authorization service response exception.
incorrectParameter0x40001157Authorization service parameters error.
operationFailed0x40001158Operating authorization service error.
noAnalysisResourceOr
NoDataInTheListLibrary
0x40001159No cloud analytic resources or no data in the list
library.
calculationException0x4000115ACalculation exception.
allocatingList0x4000115BAllocating list.
Intelligent Security API (Access Control on Person) Developer Guide
## 403

Sub Status CodeError CodeDescription
thisOperationIsNotSup
portedByTheCloudAnal
ytics
0x4000115CThis operation is not supported by the cloud
analytic serice.
theCloudAnalyticsIsInt
errupted
0x4000115DThe operation of cloud analytic serice is
interrupted.
theServiceIsNotReady0x4000115EThe service is not ready.
searchingForExternalA
piFailed
0x4000115FSearching external interfaces failed.
noOnlineNode0x40001160No node is online.
noNodeAllocated0x40001161No allocated node.
noMatchedList0x40001162No matched list.
allocatingFailedTooMa
nyFacePictureLists
0x40001163Allocation failed. Too many lists of big data
service.
searchIsNotCompleted
SearchAgain
0x40001164Current searching is not completed. Search
again.
allocatingListIsNotCom
pleted
0x40001165Allocating list is not completed.
searchingForCloudAnal
yticsResultsFailed
0x40001166Searching cloud analytic serice overtime.
noDataOfTheCurrentLi
braryFound
0x40001167No data in the current library. Make sure there
is data in the Hbase.
noFacePictureLibraryIs
## Armed
0x40001168No face picture library is armed for big data
service.
noAvailableDataSlicing
VersionInformationAr
mFirstAndSliceTheData
0x40001169Invalid standard version information.
duplicatedOperationDa
taSlicingIsExecuting
0x4000116ASlicing failed. Duplicated operation.
slicinDataFailedNoArm
edFacePictureLibrary
0x4000116BSlicing failed. No arming information in the face
big data.
GenerateBenchmarkFil
eFailedSlicingAgain
0x4000116CGenerating sliced file failed. Slice again.
Intelligent Security API (Access Control on Person) Developer Guide
## 404

Sub Status CodeError CodeDescription
NonprimaryNodeIsPro
hibitedFromSlcingData
0x4000116DSlicing is not allowed by the backup node.
NoReadyNodeToCluste
rServers
0x4000116ECreating the cluster failed. No ready node.
NodeManagementServ
iceIsOffline
0x4000116FThe node management server is offline.
theCamera(s)OfTheCo
ntrolCenterAreAlready
Armed.DisarmThemFir
st
0x40001170Some cameras in control center are already
armed. Disarm them and try again.
theCamera(s)OfTheAre
aAreAlreadyArmed.Dis
armThemFirst
0x40001171Some cameras in this area are already armed.
Disarm them and try again.
configuringHigh-
frequencyPeopleDetect
ionFailed
0x40001172Configuring high frequency people detection
failed.
searchingForHigh-
frequencyPeopleDetect
ionLogsFailed.
0x40001173Searching detection event logs of high-
frequency people detection failed.
gettingDetailsOfSearch
edHigh-
frequencyPeopleDetect
ionLogsFailed.
0x40001174Getting the search result details of high
frequency alarms failed.
theArmedCamerasAlre
adyExistInTheControlC
enter
0x40001175Some cameras in control center are already
armed.
disarmingFailedTheCa
meraIsNotArmed
0x40001177Disarming failed. The camera is not armed.
noDataReturned0x40001178No response is returned by the big data service.
preallocFailure0x40001179Pre-​allocating algorithm resource failed.
overDogLimit0x4000117AConfiguration failed. No more resources can be
pre-allocated.
analysisServicesDoNot
## Support
0x4000117BNot supported.
Intelligent Security API (Access Control on Person) Developer Guide
## 405

Sub Status CodeError CodeDescription
commandAndDispatch
ServiceError
0x4000117CScheduling service of cloud analytic serice error.
engineModuleError0x4000117DEngine module of cloud analytic serice error.
streamingServiceError0x4000117EStreaming component of cloud analytic serice
error.
faceAnalysisModuleErr
or
0x4000117FFace analysis module of cloud analytic serice
error.
vehicleAnalysisModule
## Error
0x40001180Vehicle pictures analytic module of cloud
analytic serice error.
videoStructuralAnalysis
ModuleError
0x40001181Video structuring module of cloud analytic
serice error.
postprocessingModule
## Error
0x40001182Post-processing module of cloud analytic serice
error.
frequentlyAppearedPe
rsonAlarmIsAlreadyCo
nfiguredForListLibrary
0x40001183High frequency alarm is already armed for
blacklist library.
creatingListLibraryFaile
d
0x40001184Creating list library failed.
invalidIdentiryKeyOfLis
tLibrary
0x40001185Invalid identity key of list library.
noMoreDevicesCanBe
## Armed
0x40001186No more camera can be added.
settingAlgorithmTypeF
orDeviceFailed
0x40001187Allocating task resource failed.
gettingHighFrequencyP
ersonDetectionAlarmIn
formationFailed
0x40001188Setting high frequency alarm failed.
invalidSearchConfition0x40001189Invalid result.
theTaskIsNotComplete
d
0x4000118BThe task is not completed.
resourceOverRemainLi
mit
0x4000118CNo more resource can be pre-allocated.
Intelligent Security API (Access Control on Person) Developer Guide
## 406

Sub Status CodeError CodeDescription
frequentlyAppearedPe
rsonAlarmIs
AlreadyConfiguredForT
heCameraDisarmFirstA
ndTryAgain
0x4000118DThe high frequency alarm of this camera is
configured. Delete the arming information and
try again.
noMorePeopleNumCh
angeRulesAdded
0x4000128AMaximum number of people number changing
rules reached.
noMoreViolentMotion
RulesAdded
0x4000128DMaximum number of violent motion rules
reached.
noMoreLeavePositionR
ulesAdded
0x4000128EMaximum number of leaving position rules
reached.
SMRDiskNotSupportRa
id
0x40001291SMR disk does not support RAID.
vehicleEnginesNoReso
urce
0x400012a6Insufficient vehicle engine resources.
noMoreRunningRulesA
dded
0x400012a9Maximum number of running rules reached.
noMoreGroupRulesAd
ded
0x400012aaMaximum number of people gathering rules
reached.
noMoreFailDownRules
## Added
0x400012abMaximum number of people falling down rules
reached.
noMorePlayCellphone
RulesAdded
0x400012acMaximum number of playing cellphone rules
reached.
noMoreRetentionRules
## Added
0x400015adMaximum number of people retention rules
reached.
noMoreSleepOnDutyR
ulesAdded
0x400015aeMaximum number of sleeping on duty rules
reached.
noClientCertificate0x40002036The client certificate is not installed.
noCACertificate0x40002037The CA certificate is not installed.
authenticationFailed0x40002038Authenticating certificate failed. Check the
certificate.
clientCertificateExpired0x40002039The client certificate is expired.
clientCertificateRevocat
ion
0x4000203AThe client certificate is revoked.
Intelligent Security API (Access Control on Person) Developer Guide
## 407

Sub Status CodeError CodeDescription
CACertificateExpired0x4000203BThe CA certificate is expired.
CACertificateRevocatio
n
0x4000203CThe CA certificate is revoked.
connectFail0x4000203DConnection failed.
loginNumExceedLimit0x4000203FNo more user can log in.
formattingFailed0x40002056Formatting HDD failed.
encryptedFormattingFa
iled
0x40002057Formatting encrypted HDD failed.
audioIsPlayingPleaseW
ait
0x40002067Audio is playing. Please wait.
twoWayAudioInProgre
ssPleaseWait
0x40002068Two-way audio in progress. Please wait.
calibrationPointNumFu
ll
0x40002069The maximum number of calibration points
reached.
wrongPassword0x40002058Verifying password of SD card failed. Incorrect
password.
noDetectionArea0x400050dfNo detection area
armingFailed0x40008000Arming failed.
disarmingFailed0x40008001Disarming failed.
clearAlarmFailed0x40008002Clearing alarm failed.
bypassFailed0x40008003Bypass failed.
bypassRecoverFailed0x40008004Bypass recovery failed.
outputsOpenFailed0x40008005Opening relay failed.
outputsCloseFailed0x40008006Closing relay failed.
registerTimeOut0x40008007Registering timed out.
registerFailed0x40008008Registering failed.
addedByOtherHost0x40008009The peripheral is already added by other
security control panel.
alreadyAdded0x4000800AThe peripheral is already added.
armedStatus0x4000800BThe partition is armed.
bypassStatus0x4000800CBypassed.
Intelligent Security API (Access Control on Person) Developer Guide
## 408

Sub Status CodeError CodeDescription
zoneNotSupport0x4000800DThis operation is not supported by the zone.
zoneFault0x4000800EThe zone is in fault status.
pwdConflict0x4000800FPassword conflicted.
audioTestEntryFailed0x40008010Enabling audio test mode failed.
audioTestRecoveryFaile
d
0x40008011Disabling audio test mode failed.
addCardMode0x40008012Adding card mode.
searchMode0x40008013Search mode.
addRemoterMode0x40008014Adding keyfob mode.
registerMode0x40008015Registration mode.
exDevNotExist0x40008016The peripheral does not exist.
theNumberOfExDevLi
mited
0x40008017No peripheral can be added.
sirenConfigFailed0x40008018Setting siren failed.
chanCannotRepeatedB
inded
0x40008019This channel is already linked by the zone.
masterSlaveIsEnable0x4000802cThe master-slave relationship has taken effect,
the slave radar does not support this operation.
forceTrackNotEnabled0x4000802dMandatory tracking is disabled.
isNotSupportZoneConfi
gByLocalArea
0x4000802eThis area does not support the zone type.
alarmLineCross0x4000802fTrigger lines are overlapped.
zoneDrawingOutOfRan
ge
0x40008030The drawn zone is out of detection range.
alarmLineDrawingOut
OfRange
0x40008031The drawn alarm trigger line is out of detection
range.
hasTargetInWarningAr
ea
0x40008032The warning zone already contains targets.
Whether to enable mandatory arming?
radarMoudleConnectF
ail
0x40008033Radar module communication failed.
importCfgFilePassword
## Err
0x40008034Incorrect password for importing configuration
files.
Intelligent Security API (Access Control on Person) Developer Guide
## 409

Sub Status CodeError CodeDescription
inProgramMode0x4000801BThe keypad is in programming mode.
inPaceTest0x4000801CIn pacing mode.
arming0x4000801DArming.
HDMIResolutionIllegal/The HDMI video resolution cannot be larger
than that of main and sub stream.
startAppFail/Starting running application program failed.
yuvconflict/The raw video stream conflicted.
overMaxAppNum/No more application program can be uploaded.
alreadyExist/The application program already exists.
noFlash/Insufficient flash.
noFlash/The platform mismatches.
alreadyRunning/The application program is running.
notRunning/The application program is stopped.
packNotFound/The software packet does not exist.
noMemory/Insufficient memory.
invalLicense/Invalid Licnese.
switchtimedifflesslimit0x4000123bTime difference between power on and off
should be less than 10 minutes.
OnlySupportHikAndCus
tomProtocol
0x400012a3IPv6 camera can only be added via Device
Network SDK or custom protocols.
StatusCode=5
Sub Status CodeError CodeDescription
badXmlFormat0x50000001Invalid XML format.
StatusCode=6
Sub Status CodeError CodeDescription
badParameters0x60000001Invalid parameter.
badHostAddress0x60000002Invalid host IP address.
badXmlContent0x60000003Invalid XML content.
Intelligent Security API (Access Control on Person) Developer Guide
## 410

Sub Status CodeError CodeDescription
badIPv4Address0x60000004Invalid IPv4 address.
badIPv6Address0x60000005Invalid IPv6 address.
conflictIPv4Address0x60000006IPv4 address conflicted.
conflictIPv6Address0x60000007IPv6 address conflicted.
badDomainName0x60000008Invalid domain name.
connectSreverFail0x60000009Connecting to server failed.
conflictDomainName0x6000000ADomain name conflicted.
badPort0x6000000BPort number conflicted.
portError0x6000000CPort error.
exportErrorData0x6000000DImporting data failed.
badNetMask0x6000000EInvalid sub-net mask.
badVersion0x6000000FVersion mismatches.
badDevType0x600000010Device type mismatches.
badLanguage0x600000011Language mismatches.
incorrentUserNameOrPasswor
d
0x600000012Incorrect user name or
password.
invalidStoragePoolOfCloudServ
er
0x600000013Invalid storage pool. The
storage pool is not configured
or incorrect ID.
noFreeSpaceOfStoragePool0x600000014Storage pool is full.
riskPassword0x600000015Risky password.
UnSupportCapture0x600000016Capturing in 4096*2160 or
3072*2048 resolution is not
supported when H.264+ is
enabled.
userPwdLenUnder80x60000023At least two kinds of
characters, including digits,
letters, and symbols, should be
contained in the password.
userPwdNameSame0x60000025Duplicated password.
userPwdNameMirror0x60000026The password cannot be the
reverse order of user name.
Intelligent Security API (Access Control on Person) Developer Guide
## 411

Sub Status CodeError CodeDescription
beyondARGSRangeLimit0x60000027The parameter value is out of
limit.
DetectionLineOutofDetectionR
egion
0x60000085The rule line is out of region.
DetectionRegionError0x60000086Rule region error. Make sure
the rule region is convex
polygon.
DetectionRegionOutOfCountin
gRegion
0x60000087The rule region must be
marked as red frame.
PedalAreaError0x60000088The pedal area must be in the
rule region.
DetectionAreaABError0x60000089The detection region A and B
must be in the a rule frame.
ABRegionCannotIntersect0x6000008aRegion A and B cannot be
overlapped.
analysisEnginesNoResourceErr
or
0x60001000No analysis engine.
analysisEnginesUsageExcced0x60001001The engine usage is
overloaded.
PicAnalysisNoResourceError0x60001002No analysis engine provided for
picture secondary recognition.
analysisEnginesLoadingError0x60001003Initializing analysis engine.
analysisEnginesAbnormaError0x60001004Analysis engine exception.
analysisEnginesFacelibImportin
g
0x60001005Importing pictures to face
picture library. Failed to edit
analysis engine parameters.
analysisEnginesAssociatedChan
nel
0x60001006The analysis engine is linked to
channel.
smdEncodingNoResource0x60001007Insufficient motion detection
encoding resources.
smdDecodingNoResource0x60001008Insufficient motion detection
decoding resources.
diskError0x60001009HDD error.
Intelligent Security API (Access Control on Person) Developer Guide
## 412

Sub Status CodeError CodeDescription
diskFull0x6000100aHDD full.
facelibDataProcessing0x6000100bHandling face picture library
data.
capturePackageFailed0x6000100cCapturing packet failed.
capturePackageProcessing0x6000100dCapturing packet.
noSupportWithPlaybackAbstra
ct
0x6000100eThis function is not supported.
Playback by video synopsis is
enabled.
insufficientNetworkBandwidth0x6000100fInsufficient network
bandwidth.
tapeLibNeedStopArchive0x60001010Stop the filing operation of
tape library first.
identityKeyError0x60001011Incorrect interaction command.
identityKeyMissing0x60001012The interaction command is
lost.
noSupportWithPersonDensityD
etect
0x60001013This function is not supported.
The people density detection is
enabled.
ipcResolutionOverflow0x60001014The configured resolution of
network camera is invalid.
ipcBitrateOverflow0x60001015The configured bit rate of
network camera is invalid.
tooGreatTimeDifference0x60001016Too large time difference
between device and server.
noSupportWithPlayback0x60001017This function is not supported.
Playback is enabled.
channelNoSupportWithSMD0x60001018This function is not supported.
Motion detection is enabled.
channelNoSupportWithFD0x60001019This function is not supported.
Face capture is enabled.
illegalPhoneNumber0x6000101aInvalid phone number.
illegalCertificateNumber0x6000101bInvalid certificate No.
linkedCameraOutLimit0x6000101cConnecting camera timed out.
Intelligent Security API (Access Control on Person) Developer Guide
## 413

Sub Status CodeError CodeDescription
achieveMaxChannelLimit0x6000101eNo more channels are allowed.
humanMisInfoFilterEnabledCha
nNumError
0x6000101fNo more channels are allowed
to enable preventing false
alarm.
humanEnginesNoResource0x60001020Insufficient human body
analysis engine resources.
taskNumberOverflow0x60001021No more tasks can be added.
collisionTimeOverflow0x60001022No more comparison duration
can be configured.
invalidTaskID0x60001023Invalid task ID.
eventNotSupport0x60001024Event subscription is not
supported.
invalidEZVIZSecretKey0x60001034Invalid verification code for Hik-
## Connect.
needDoubleVerification0x60001042Double verification required
noDoubleVerificationUser0x60001043No double verification user
timeSpanNumOverLimit0x60001044Max. number of time buckets
reached
channelNumOverLimit0x60001045Max. number of channels
reached
noSearchIDResource0x60001046Insufficient searchID resources
noSupportDeleteStrangerLib0x60001051Deleting stranger library is not
supported
noSupportCreateStrangerLib0x60001052Creating stranger library is not
supported
behaviorAnalysisRuleInfoError0x60001053Behavior analysis rule
parameters error.
safetyHelmetParamError0x60001054Hard hat parameters error.
OneChannelOnlyCanBindOneE
ngine
0x60001077No more engines can be
bound.
TransitionUseEmmc0x60002000Starting device failed. The
EMMC is overused.
Intelligent Security API (Access Control on Person) Developer Guide
## 414

Sub Status CodeError CodeDescription
AdaptiveStreamNotEnabled0x60002001The stream self-​adaptive
function is not enabled.
AdaptiveStreamAndVariableBit
rateEnabled
0x60002002Stream self-​adptive and
variable bitrate function cannot
be enabled at the same time.
PTZNotInitialized0x6000202EPTZ is not initialized.
PTZSelfChecking0x6000202FPTZ is self-checking.
noSafetyHelmetRegion0x60002023The hard hat detection area is
not configured (if users save
their settings without
configuring the arming area,
they should be prompted to
configure one).
unclosedSafetyHelmet0x60002024The hard hat detection is
enabled (If users save their
settings after deleting the
arming area, they should be
prompted to disable hard hat
detection first and then delete
the arming area).
PTZLocked0x60002030PTZ is locked.
deployExceedMax0x60006018The arming connections exceed
the maximum number.
detectorTypeMismatch0x60008000The detector type mismatched.
nameExist0x60008001The name already exists.
laneAndRegionOverlapNone.The lanes are overlapped.
unitConfigurationNotInEffect/Invalid unit parameter.
ruleAndShieldingMaskConflict/The line-rule region overlaps
with the shielded area.
wholeRuleInShieldingMask/There are complete
thermometry rules in the
shielded area.
Intelligent Security API (Access Control on Person) Developer Guide
## 415

Sub Status CodeError CodeDescription
LogDiskNotSetReadOnlyInGrou
pMode
0x60001100The log HDD in the HDD group
cannot be set to read-only.
LogDiskNotSetReDundancyInGr
oupMode
0x60001101The log HDD in the HDD group
cannot be set to redundancy.
StatusCode=7
SubStatusCodeError CodeDescription
rebootRequired0x70000001Reboot to take effect.
Intelligent Security API (Access Control on Person) Developer Guide
## 416

