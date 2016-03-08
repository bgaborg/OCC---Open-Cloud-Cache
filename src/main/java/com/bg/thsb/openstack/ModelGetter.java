package com.bg.thsb.openstack;


import org.openstack4j.api.OSClient;
import org.openstack4j.model.compute.Server;
import org.openstack4j.openstack.OSFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.List;

@Component
public class ModelGetter implements CommandLineRunner {

	@Autowired
	OpenStackConfiguration openStackConfiguration;

	@Override
	public void run(String... args) throws Exception {
		OSClient os = OSFactory.builder()
			.endpoint(openStackConfiguration.getEndpoint())
			.credentials(openStackConfiguration.getUser(), openStackConfiguration.getUserPass())
			.tenantName(openStackConfiguration.getTenant())
			.authenticate();

		List<? extends Server> servers = os.compute().servers().list();
		System.out.println(servers);

		/*try {
			FileOutputStream fileOutputStream = new FileOutputStream(OpenStackConfiguration.SERVERS_FILE);
			ObjectOutputStream oos = new ObjectOutputStream(fileOutputStream);
			oos.writeObject(servers);
		} catch (IOException e) {
			e.printStackTrace();
		}*/
	}
}
