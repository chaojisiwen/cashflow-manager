import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2, Trash2, Plus, Camera } from 'lucide-react';
import type { Liability, LoanRepaymentSchedule } from '@/types/finance';

interface ImportRepaymentScheduleProps {
  liabilities: Liability[];
  onImport: (liabilityId: string, schedules: LoanRepaymentSchedule[]) => void;
}

// OCR API 地址（部署后替换为实际的云函数地址）
const OCR_API_URL = 'https://service-xxx.gz.apigw.tencentcs.com/release/ocr-parser';

export function ImportRepaymentSchedule({ liabilities, onImport }: ImportRepaymentScheduleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [parsedSchedules, setParsedSchedules] = useState<LoanRepaymentSchedule[]>([]);
  const [rawText, setRawText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 预览图片
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 转换为base64并调用OCR
    setIsLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await callOCRAPI(base64);
      
      if (result.success && result.schedules) {
        setParsedSchedules(result.schedules);
        setRawText(result.rawText || '');
      } else {
        alert('未能识别到还款计划，请手动输入');
      }
    } catch (error) {
      console.error('OCR识别失败:', error);
      alert('OCR识别失败，请检查网络或手动输入');
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const callOCRAPI = async (imageBase64: string) => {
    // 如果API未配置，使用模拟数据（开发测试用）
    if (OCR_API_URL.includes('xxx')) {
      // 模拟OCR结果
      return {
        success: true,
        rawText: '32期 2026/04/25 ¥262.64 本金¥0.00 利息¥262.64',
        schedules: [
          { period: 32, dueDate: '2026-04-25', totalAmount: 262.64, principal: 0, interest: 262.64, remainingPrincipal: 100000, isPaid: false },
          { period: 33, dueDate: '2026-05-25', totalAmount: 254.17, principal: 0, interest: 254.17, remainingPrincipal: 100000, isPaid: false },
        ],
      };
    }

    const response = await fetch(OCR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });
    return response.json();
  };

  const handleAddSchedule = () => {
    const newSchedule: LoanRepaymentSchedule = {
      id: Date.now().toString(),
      period: parsedSchedules.length + 1,
      dueDate: '',
      totalAmount: 0,
      principal: 0,
      interest: 0,
      remainingPrincipal: 0,
      isPaid: false,
    };
    setParsedSchedules([...parsedSchedules, newSchedule]);
  };

  const handleRemoveSchedule = (index: number) => {
    setParsedSchedules(parsedSchedules.filter((_, i) => i !== index));
  };

  const handleUpdateSchedule = (index: number, field: keyof LoanRepaymentSchedule, value: string | number | boolean) => {
    const updated = [...parsedSchedules];
    updated[index] = { ...updated[index], [field]: value };
    setParsedSchedules(updated);
  };

  const handleImport = () => {
    if (!selectedLoanId) {
      alert('请先选择要导入的贷款');
      return;
    }
    if (parsedSchedules.length === 0) {
      alert('没有可导入的还款计划');
      return;
    }
    
    // 为每个schedule生成id
    const schedulesWithId = parsedSchedules.map(s => ({
      ...s,
      id: s.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }));
    
    onImport(selectedLoanId, schedulesWithId);
    setIsOpen(false);
    resetState();
  };

  const resetState = () => {
    setSelectedLoanId('');
    setPreviewImage(null);
    setParsedSchedules([]);
    setRawText('');
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Camera className="w-4 h-4 mr-1" />
        导入还款计划
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>导入还款计划（截图识别）</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* 选择贷款 */}
            <div>
              <Label>选择要导入的贷款</Label>
              <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择贷款" />
                </SelectTrigger>
                <SelectContent>
                  {liabilities.map(loan => (
                    <SelectItem key={loan.id} value={loan.id}>{loan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 上传截图 */}
            <div>
              <Label>上传还款计划截图</Label>
              <div className="mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full h-24 border-dashed"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : previewImage ? (
                    <img src={previewImage} alt="预览" className="h-20 object-contain" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-sm">点击上传截图</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* 识别的原始文本（调试用，可折叠） */}
            {rawText && (
              <details className="text-sm">
                <summary className="cursor-pointer text-muted-foreground">查看识别的原始文本</summary>
                <pre className="mt-2 p-2 bg-slate-50 rounded text-xs whitespace-pre-wrap">{rawText}</pre>
              </details>
            )}

            {/* 还款计划列表 */}
            {parsedSchedules.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>还款计划明细 ({parsedSchedules.length}期)</Label>
                  <Button variant="ghost" size="sm" onClick={handleAddSchedule}>
                    <Plus className="w-4 h-4 mr-1" />添加一期
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {parsedSchedules.map((schedule, index) => (
                    <div key={index} className="grid grid-cols-6 gap-2 p-2 bg-slate-50 rounded items-center">
                      <Input
                        type="number"
                        placeholder="期数"
                        value={schedule.period}
                        onChange={e => handleUpdateSchedule(index, 'period', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                      <Input
                        type="date"
                        placeholder="还款日"
                        value={schedule.dueDate}
                        onChange={e => handleUpdateSchedule(index, 'dueDate', e.target.value)}
                        className="h-8"
                      />
                      <Input
                        type="number"
                        placeholder="月供"
                        value={schedule.totalAmount}
                        onChange={e => handleUpdateSchedule(index, 'totalAmount', parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                      <Input
                        type="number"
                        placeholder="本金"
                        value={schedule.principal}
                        onChange={e => handleUpdateSchedule(index, 'principal', parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                      <Input
                        type="number"
                        placeholder="利息"
                        value={schedule.interest}
                        onChange={e => handleUpdateSchedule(index, 'interest', parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveSchedule(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => { setIsOpen(false); resetState(); }} className="flex-1">
                取消
              </Button>
              <Button onClick={handleImport} disabled={parsedSchedules.length === 0} className="flex-1">
                导入到贷款
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
