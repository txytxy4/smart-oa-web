/**
 * 下载二进制流文件
 * @param blobData 二进制数据
 * @param filename 文件名
 */
export const downloadBlobFile = (blobData: Blob, filename: string) => {
    // 创建 Blob URL
    const blobUrl = URL.createObjectURL(new Blob([blobData]));
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    
    // 添加到文档并触发点击
    document.body.appendChild(link);
    link.click();
    
    // 清理
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    }, 100);
  };