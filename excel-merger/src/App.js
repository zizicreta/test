import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import armyBack from './images/army_back.jpg';

// localStorage 키 상수 정의
const SAVED_HEADERS_KEY = 'savedSelectedHeaders';

function App() {
  // 암호화/복호화 함수를 먼저 정의
  const encrypt = (text) => {
    return btoa(text); // base64 인코딩
  };

  const decrypt = (encoded) => {
    return atob(encoded); // base64 디코딩
  };

  // State 변수들을 그 다음에 정의
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileHeaders, setFileHeaders] = useState({});
  const [selectedHeaders, setSelectedHeaders] = useState(() => {
    // 초기값으로 저장된 헤더 정보 불러오기
    const savedHeaders = localStorage.getItem(SAVED_HEADERS_KEY);
    return savedHeaders ? JSON.parse(savedHeaders) : [];
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fileOrder, setFileOrder] = useState([]);
  const [password, setPassword] = useState(() => {
    const savedPassword = localStorage.getItem('encryptedPassword');
    return savedPassword ? decrypt(savedPassword) : '1234';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedHeader, setDraggedHeader] = useState(null);
  const [dragOverHeader, setDragOverHeader] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');

  // useEffect 수정
  useEffect(() => {
    localStorage.setItem('selectedHeaders', JSON.stringify(selectedHeaders));
  }, [selectedHeaders]);

  // alert 대체
  const showAlert = (message) => {
    alert(message);
  };

  // 비밀번호 변경 시 로컬 스토리지에 저장
  const handlePasswordChange = (event) => {
    event.preventDefault();
    if (currentPassword === password) {
      const encryptedNewPassword = encrypt(newPassword);
      localStorage.setItem('encryptedPassword', encryptedNewPassword);
      setPassword(newPassword);
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      showAlert('비밀번호가 변경되었습니다.');
    } else {
      showAlert('현재 비밀번호가 일치하지 않습니다.');
    }
  };

  // 컴포넌트 마운트 시 초기 비밀번호 저장
  useEffect(() => {
    if (!localStorage.getItem('encryptedPassword')) {
      localStorage.setItem('encryptedPassword', encrypt('1234'));
    }
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const enteredPassword = event.target.password.value;
    if (enteredPassword === password) {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  }; 

  // 고유한 헤더 목록 생성
  const uniqueHeaders = useMemo(() => {
    const headers = new Set();
    Object.values(fileHeaders).forEach(fileHeader => {
      fileHeader.forEach(header => headers.add(header));
    });
    return Array.from(headers);
  }, [fileHeaders]);

  // Excel 파일 읽기 함수
  const readExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    
    const headers = {};
    for (const file of files) {
      const workbook = await readExcel(file);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (data.length > 0) {
        headers[file.name] = data[0];
      }
    }
    setFileHeaders(headers);

    // 저장된 헤더 정보 불러오기
    const savedHeaders = localStorage.getItem(SAVED_HEADERS_KEY);
    if (savedHeaders) {
      const parsedHeaders = JSON.parse(savedHeaders);
      // 현재 파일들의 헤더들 중에서 저장된 헤더만 선택
      const validHeaders = parsedHeaders.filter(header => 
        Object.values(headers).some(fileHeaders => 
          fileHeaders.includes(header)
        )
      );
      setSelectedHeaders(validHeaders);
    }
  };

  // 헤더 선택 핸들러
  const handleHeaderSelect = (header, isSelected) => {
    setSelectedHeaders(prev => {
      if (isSelected) {
        return [...prev, header];
      } else {
        return prev.filter(h => h !== header);
      }
    });
  };

  // 선택 확인 버튼 핸들러
  const handleConfirmation = () => {
    console.log("선택확인 버튼 클릭됨");
    setShowConfirmation(true);
  };

  // 병합 버튼 핸들러 수정
  const handleMerge = async () => {
    try {
      let rowsWithoutNIIN = [];
      let processedRows = 0;
      const mergedDataMap = new Map();
      
      // 선택된 헤더에 NIIN이 없으면 추가
      const finalHeaders = ['NIIN', ...selectedHeaders.filter(h => h !== 'NIIN')];
      
      for (const file of selectedFiles) {
        try {
          const workbook = await readExcel(file);
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet);
          
          if (!data || data.length === 0) {
            throw new Error(`파일 '${file.name}'에 데이터가 없습니다.`);
          }

          data.forEach((row, index) => {
            // NIIN이 없거나 빈 값인 경우 처리
            if (!row.NIIN && row.NIIN !== 0) {
              rowsWithoutNIIN.push({
                file: file.name,
                row: index + 2
              });
              return;
            }

            // NIIN을 문자열로 변환하여 저장
            const niin = (row.NIIN || '').toString().trim();
            if (!niin) {
              rowsWithoutNIIN.push({
                file: file.name,
                row: index + 2
              });
              return;
            }

            const existingRow = mergedDataMap.get(niin) || {};
            existingRow['NIIN'] = niin;
            
            finalHeaders.forEach(header => {
              if (row[header] !== undefined && row[header] !== '') {
                existingRow[header] = row[header];
              } else if (!existingRow[header]) {
                existingRow[header] = '';
              }
            });

            mergedDataMap.set(niin, existingRow);
            processedRows++;
          });

        } catch (error) {
          throw new Error(`파일 '${file.name}' 처리 중 오류 발생: ${error.message}`);
        }
      }

      // 데이터가 없는 경우 처리
      if (mergedDataMap.size === 0) {
        throw new Error('병합할 데이터가 없습니다.');
      }

      // 헤더 소스 정보 생성
      const headerSourceRow = {};
      finalHeaders.forEach(header => {
        headerSourceRow[header] = '소스 정보';  // 또는 실제 소스 정보 추가
      });

      // Map을 배열로 변환하고 NIIN 기준으로 정렬
      const mergedData = Array.from(mergedDataMap.values()).sort((a, b) => {
        const niinA = (a.NIIN || '').toString();
        const niinB = (b.NIIN || '').toString();
        
        const numA = niinA.replace(/\D/g, '');
        const numB = niinB.replace(/\D/g, '');
        
        if (!numA && !numB) return 0;
        if (!numA) return 1;
        if (!numB) return -1;
        
        return numA.localeCompare(numB, undefined, { numeric: true });
      });

      // 소스 정보 행을 추가
      const finalData = [headerSourceRow, ...mergedData];

      // 새로운 워크북 생성
      const newWorkbook = XLSX.utils.book_new();
      
      // 워크시트 생성
      const newWorksheet = XLSX.utils.json_to_sheet(finalData, {
        header: finalHeaders
      });

      // 열 너비 자동 조정
      const maxWidth = 50;
      const minWidth = 10;
      const widths = finalHeaders.map(header => {
        const headerWidth = header.length;
        const sourceWidth = (headerSourceRow[header] || '').length;
        const maxDataWidth = Math.max(
          ...mergedData.map(row => 
            row[header] ? row[header].toString().length : 0
          )
        );
        return Math.min(Math.max(headerWidth, sourceWidth, maxDataWidth, minWidth), maxWidth);
      });

      newWorksheet['!cols'] = widths.map(width => ({ width }));

      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "병합된 데이터");

      // 파일 저장
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      XLSX.writeFile(newWorkbook, `병합된_파일_${dateStr}.xlsx`);
      
      // 선택된 헤더 정보 저장
      localStorage.setItem(SAVED_HEADERS_KEY, JSON.stringify(selectedHeaders));

      // NIIN 누락 데이터 경고
      if (rowsWithoutNIIN.length > 0) {
        alert(
          '다음 행들에서 NIIN 번호가 누락되어 제외되었습니다:\n' +
          rowsWithoutNIIN.map(item => `${item.file} - ${item.row}행`).join('\n')
        );
      }

      // 처리 완료 메시지
      alert(
        `병합이 완료되었습니다.\n\n` +
        `- 총 처리된 행: ${processedRows}개\n` +
        `- 중복 제거 후 행: ${mergedDataMap.size}개\n` +
        `- 제외된 행 (NIIN 누락): ${rowsWithoutNIIN.length}개\n` +
        `- 선택된 헤더 수: ${finalHeaders.length}개`
      );

    } catch (error) {
      console.error('병합 중 오류 발생:', error);
      alert(
        `파일 병합 중 오류가 발생했습니다.\n\n` +
        `오류 내용: ${error.message}\n\n` +
        `다음 사항을 확인해주세요:\n` +
        `1. 모든 파일에 NIIN 컬럼이 있는지 확인\n` +
        `2. 파일이 올바른 Excel 형식인지 확인\n` +
        `3. 파일이 손상되지 않았는지 확인\n` +
        `4. 충분한 메모리가 있는지 확인`
      );
    }
  };

  // 파일 삭제 핸들러 추가
  const handleFileDelete = (fileName) => {
    // 선택된 파일 목록에서 제거
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    
    // 파 헤더 목록에서 제거
    const newFileHeaders = { ...fileHeaders };
    delete newFileHeaders[fileName];
    setFileHeaders(newFileHeaders);
  };

  // 파일 드래그 앤 드롭 핸들러
  const handleFileDragStart = (e, index) => {
    e.dataTransfer.setData('fileIndex', index.toString());
  };

  const handleFileDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('fileIndex'));
    if (dragIndex === dropIndex) return;

    const newFileOrder = [...fileOrder];
    const [movedFile] = newFileOrder.splice(dragIndex, 1);
    newFileOrder.splice(dropIndex, 0, movedFile);
    setFileOrder(newFileOrder);
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
  };

  const handleMergeConfirm = () => {
    setIsDialogOpen(true); // 다이얼로그 열기 전 오버레이 표시
    const confirmed = window.confirm("저장하시겠습니까?");
    setIsDialogOpen(false); // 다이얼로그 닫힌 후 오버레이 제거
    
    if (confirmed) {
      handleMerge();
    }
  };

  // body 클래스 관리를 위한 useEffect 추가
  useEffect(() => {
    if (isDialogOpen) {
      document.body.classList.add('dialog-open');
    } else {
      document.body.classList.remove('dialog-open');
    }
  }, [isDialogOpen]);

  // 드래그 앤 드롭 핸들러 추가
  const handleHeaderDragStart = (header) => {
    if (header === 'NIIN') return;
    setDraggedHeader(header);
  };

  const handleHeaderDragEnd = () => {
    setDraggedHeader(null);
    setDragOverHeader(null);
  };

  const handleHeaderDragOver = (e, header) => {
    e.preventDefault();
    if (header !== dragOverHeader) {
      setDragOverHeader(header);
    }
  };

  const handleHeaderDrop = (e, targetHeader) => {
    e.preventDefault();
    if (!draggedHeader || draggedHeader === targetHeader) return;

    setSelectedHeaders(prev => {
      const newHeaders = [...prev];
      const draggedIndex = newHeaders.indexOf(draggedHeader);
      const targetIndex = newHeaders.indexOf(targetHeader);
      
      newHeaders.splice(draggedIndex, 1);
      newHeaders.splice(targetIndex, 0, draggedHeader);
      
      return newHeaders;
    });

    setDraggedHeader(null);
    setDragOverHeader(null);
  };

  // 파일 선택 핸들러 추가
  const handleFileNameSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  // 취소 버튼 핸들러 추가
  const handleCancel = () => {
    setShowConfirmation(false);
    // 취소 시에는 헤더 정보를 저장하지 않음
  };

  if (!isAuthenticated) {
    return (
      <div 
        className="login-page" 
        style={{ 
          backgroundImage: `url(${armyBack})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          height: '100vh'
        }}
      >
        <div className="login-overlay">
          <div className="login-title">
            <h1>군수사령부</h1>
            <h2>단종부품 관리 프로그램</h2>
          </div>
          <div className="login-container">
            {!showPasswordChange ? (
              <>
                <form onSubmit={handleLogin}>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button type="submit">로그인</button>
                </form>
                <button 
                  className="change-password-button"
                  onClick={() => setShowPasswordChange(true)}
                >
                  비밀번호 변경
                </button>
              </>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호"
                />
                <div className="password-change-buttons">
                  <button type="submit">변경</button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowPasswordChange(false);
                      setCurrentPassword('');
                      setNewPassword('');
                    }}
                  >
                    취소
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="app-container" 
      style={{ 
        backgroundImage: `url(${armyBack})`,
      }}
    >
      <div className="fixed-title">
        <h1>Excel Merger</h1>
      </div>
      
      <div className="content-wrapper">
        <div className="file-section">
          <input
            type="file"
            multiple
            accept=".xlsx"
            onChange={handleFileSelect}
          />
          <p>선택된 파일: {selectedFiles.length}개</p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="header-section">
            <h3>공통 헤 선택</h3>
            {selectedFiles.map((file, index) => (
              <div key={file.name} className="file-header-group">
                <div className="file-name">
                  <span className="file-count">
                    {`파일 ${index + 1} / ${selectedFiles.length}`}
                  </span>
                  <span className="current-file">{file.name}</span>
                </div>
                <div className="header-list">
                  {fileHeaders[file.name]?.map((header) => (
                    <div key={`${file.name}-${header}`} className="header-item">
                      <input
                        type="checkbox"
                        id={`${file.name}-${header}`}
                        checked={selectedHeaders.includes(header)}
                        onChange={(e) => handleHeaderSelect(header, e.target.checked)}
                      />
                      <label htmlFor={`${file.name}-${header}`}>{header}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed-button">
        <button 
          onClick={handleConfirmation}
          disabled={selectedHeaders.length === 0}
        >
          선택 확인
        </button>
      </div>

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>선택된 헤더</h3>
            <ul>
              <li className="niin-header">NIIN (자동 포함)</li>
              {selectedHeaders.map((header) => (
                <li 
                  key={header}
                  draggable
                  onDragStart={() => handleHeaderDragStart(header)}
                  onDragEnd={handleHeaderDragEnd}
                  onDragOver={(e) => handleHeaderDragOver(e, header)}
                  onDrop={(e) => handleHeaderDrop(e, header)}
                  className={`
                    draggable-header
                    ${draggedHeader === header ? 'dragging' : ''}
                    ${dragOverHeader === header ? 'drag-over' : ''}
                  `}
                >
                  {header}
                </li>
              ))}
            </ul>
            <div className="confirmation-buttons">
              <button onClick={handleMerge}>병합 후 저장</button>
              <button onClick={handleCancel}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;  
