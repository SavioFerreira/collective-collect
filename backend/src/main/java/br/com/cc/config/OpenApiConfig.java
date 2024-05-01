package br.com.cc.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact (
                        name = "SavioFC",
                        email = "saviofc.dev@gmail.com"
                ),
                description = "OpenApi Documentation - CC",
                title = "Collective Collect - SavioFc",
                version = "1.0"
        )
)
public interface OpenApiConfig {
}
