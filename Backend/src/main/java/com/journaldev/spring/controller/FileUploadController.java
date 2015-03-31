package com.journaldev.spring.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;
import java.text.SimpleDateFormat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 * Handles requests for the application file upload requests
 */
@Controller
public class FileUploadController {

	private static final Logger logger = LoggerFactory
			.getLogger(FileUploadController.class);

	/**
	 * Upload single file using Spring Controller
	 */
	@RequestMapping(value = "/uploadFile", method = RequestMethod.POST)
	public @ResponseBody
	String uploadFileHandler(@RequestParam("file") MultipartFile file, @RequestParam("name") String name, @RequestParam("folder") String  folder ) {
		String retval="";
		if (!file.isEmpty()) {
			try {
				byte[] bytes = file.getBytes();	
				// Creating the directory to store file
				String rootPath = System.getProperty("catalina.home");
				File dir = new File(rootPath + File.separator+"webapps" +File.separator + "externalfiledhis"+File.separator+folder);
				if (!dir.exists())
					dir.mkdirs();
				//change name using current date
				//Date now = new Date();
				//SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
				//name=format.format(now)+"-"+name;
				// Create the file on server
				File serverFile = new File(dir.getAbsolutePath()
						+ File.separator + name);
				BufferedOutputStream stream = new BufferedOutputStream(
						new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

			logger.info("Server File Location="+ serverFile.getAbsolutePath());
			
				retval="{\"url\":\"/externalfiledhis/"+folder+"/"+name+"\","
						+ "\"name\":\""+name+"\","
						+ "\"status\":\"success\","
						+ "\"description\":\"success\""
						+ "}";
				return retval;
			} catch (Exception e) {
				retval="{\"url\":\"\","
						+ "\"name\":\"\","
						+ "\"status\":\"error\","
						+ "\"description\":\""+ e.getMessage()+"\""
						+ "}";	
				return retval;
			}
		} else {
			retval="{\"url\":\"\","
					+ "\"name\":\"\","
					+ "\"status\":\"error\","
					+ "\"description\":\"failed to upload, because the file was empty.\""
					+ "}";	
				return retval;
		}
	}
}