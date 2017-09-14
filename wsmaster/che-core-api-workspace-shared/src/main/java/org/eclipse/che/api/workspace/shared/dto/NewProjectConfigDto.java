/*
 * Copyright (c) 2012-2017 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.api.workspace.shared.dto;

import static org.eclipse.che.api.core.factory.FactoryParameter.Obligation.OPTIONAL;

import java.util.List;
import java.util.Map;
import org.eclipse.che.api.core.factory.FactoryParameter;
import org.eclipse.che.api.core.model.project.NewProjectConfig;
import org.eclipse.che.api.core.rest.shared.dto.Link;
import org.eclipse.che.dto.shared.DTO;

/**
 * Data transfer object (DTO) for creating of project.
 *
 * @author Roman Nikitenko
 */
@DTO
public interface NewProjectConfigDto extends ProjectConfigDto, NewProjectConfig {
  @Override
  @FactoryParameter(obligation = OPTIONAL)
  String getName();

  @Override
  @FactoryParameter(obligation = OPTIONAL)
  String getType();

  @Override
  @FactoryParameter(obligation = OPTIONAL)
  SourceStorageDto getSource();

  @Override
  @FactoryParameter(obligation = OPTIONAL)
  Map<String, String> getOptions();

  @Override
  NewProjectConfigDto withName(String name);

  @Override
  NewProjectConfigDto withPath(String path);

  @Override
  NewProjectConfigDto withDescription(String description);

  @Override
  NewProjectConfigDto withType(String type);

  @Override
  NewProjectConfigDto withMixins(List<String> mixins);

  @Override
  NewProjectConfigDto withAttributes(Map<String, List<String>> attributes);

  @Override
  NewProjectConfigDto withSource(SourceStorageDto source);

  @Override
  NewProjectConfigDto withLinks(List<Link> links);

  @Override
  NewProjectConfigDto withProblems(List<ProjectProblemDto> problems);

  NewProjectConfigDto withOptions(Map<String, String> options);
}
