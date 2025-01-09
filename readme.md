# **🌟 돌아보니**

> **돌아보니**는 세대 간 소통의 부족으로 발생하는 갈등을 해결하기 위한 플랫폼입니다.  
> 나와 닮은 고민을 찾아 따뜻한 조언을 나누는 **익명 커뮤니티**입니다.


### **💡 속삭임 (Stories)**: 사용자의 고민과 이야기를 등록하는 공간입니다.  
- 사용자들의 투표 결과를 바탕으로 **오늘의 사연**을 선정합니다.

### **💡 메아리 (Counsels)**: 다른 사용자가 남긴 조언으로 마음의 짐을 덜어보세요. 

### **💡 메아리 찾기 (Questions)**: 자유롭게 질문하면 생성형 AI가 맞춤형 답변을 제공합니다.
- **저장된 메아리 데이터를 검색**하여 적절한 답변을 생성합니다.  
- 사연과 관련된 조언 데이터를 분석하고 **최적의 조언**을 전달합니다.

## 기술 스택
```
- Node.js: 16.17.1
- Express.js: 4.16.1  
- MySQL: 9.0.1
- mysql2/promise: 3.11.3 
- node-fetch: 2.7.0
- dotenv 16.4.5
```

## 파일 구조
```
📂bin/
📂controllers/
├── 📂counsels/
│   └── 📜ecoController.js
├── 📂questions/
│   ├── 📜questionAnswerController.js
│   └── 📜questionSupervisorController.js
├── 📂stories/
│   ├── 📜letterController.js
│   ├── 📜likeController.js
│   └── 📜selectedController.js
📂node_modules/
📂public/
📂routes/
├── 📂counsels/
│   └── 📜eco.js
├── 📂questions/
│   ├── 📜question_answer.js
│   └── 📜question_supervisor.js
├── 📂stories/
│   ├── 📜letter.js
│   ├── 📜like.js
│   ├── 📜selected.js
│   └── 📜ndex.js
📂views/
📜app.js
📜package-lock.json
📜package.json
```