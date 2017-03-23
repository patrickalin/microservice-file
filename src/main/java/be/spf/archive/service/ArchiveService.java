package be.spf.archive.service;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import be.spf.archive.dao.IDocumentDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * A service to save, find and get documents from an archive. 
 * 
 */
@Service("archiveService")
public class ArchiveService implements IArchiveService, Serializable {

    private static final long serialVersionUID = 8119784722798361327L;
    
    @Autowired
    private IDocumentDao DocumentDao;

    /**
     * Saves a document in the archive.
     * @see be.spf.archive.service.IArchiveService#save(be.spf.archive.service.Document)
     */
    @Override
    public DocumentMetadata save(Document document) {
        getDocumentDao().insert(document); 
        return document.getMetadata();
    }
    
    /**
     * Finds document in the archive
     * @see be.spf.archive.service.IArchiveService#findDocuments(java.lang.String, java.util.Date)
     */
    @Override
    public List<DocumentMetadata> findDocuments(String registrationNumber, Date date) {
        return getDocumentDao().findByRegistrationNumberDate(registrationNumber, date);
    }
    
    /**
     * Returns the document file from the archive
     * @see be.spf.archive.service.IArchiveService#getDocumentFile(java.lang.String)
     */
    @Override
    public byte[] getDocumentFile(String id) {
        Document document = getDocumentDao().load(id);
        if(document!=null) {
            return document.getFileData();
        } else {
            return null;
        }
    }


    public IDocumentDao getDocumentDao() {
        return DocumentDao;
    }

    public void setDocumentDao(IDocumentDao documentDao) {
        DocumentDao = documentDao;
    }


}
