import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = <T>(data: T[], fileName: string = "数据表.xlsx") => {
    // 1. 将 JSON 转成工作表
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. 创建工作簿并附加工作表
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // 3. 写出文件
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    // 4. 触发下载
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
};